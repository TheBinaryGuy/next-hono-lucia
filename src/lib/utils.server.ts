import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { render } from '@react-email/render';
import { eq } from 'drizzle-orm';
import { createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { createDate, isWithinExpirationDate, TimeSpan } from 'oslo';
import { alphabet, generateRandomString } from 'oslo/crypto';
import { Resend } from 'resend';

import ConfirmationCode from '@/emails/confirmation-code';
import { serverEnvs } from '@/env/server';
import { Routes } from '@/lib/routes';
import { lucia } from '@/services/auth';
import { db } from '@/services/db';
import { emailVerificationCodes } from '@/services/db/schema';

export const getUser = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value;
    if (!sessionId) return null;

    const { user } = await lucia.validateSession(sessionId);
    return user;
});

export async function ensureAuthenticated() {
    const user = await getUser();
    if (!user) {
        throw redirect(Routes.login());
    }

    return user;
}

function getSmtpTransporter() {
    let requiresAuth =
        typeof serverEnvs.SMTP_USERNAME !== 'undefined' &&
        typeof serverEnvs.SMTP_PASSWORD !== 'undefined';

    return createTransport(
        new SMTPTransport({
            auth: requiresAuth
                ? {
                      user: serverEnvs.SMTP_USERNAME,
                      pass: serverEnvs.SMTP_PASSWORD,
                  }
                : undefined,
            host: serverEnvs.SMTP_HOST,
            port: serverEnvs.SMTP_PORT,
            secure: serverEnvs.SMTP_SECURE,
        })
    );
}

// TODO: This could be injected into the function or have a factory function that returns the appropriate implementation
export async function sendVerificationCode(emailAddress: string, code: string) {
    if (serverEnvs.EMAIL_PROVIDER === 'console') {
        console.info(`Email From: ${serverEnvs.EMAIL_FROM} | Email To: ${emailAddress}`);
        console.info(`Your confirmation code: ${code}`);
        return true;
    }

    try {
        if (serverEnvs.EMAIL_PROVIDER === 'resend') {
            const resend = new Resend(serverEnvs.RESEND_API_KEY);
            const { error } = await resend.emails.send({
                from: serverEnvs.EMAIL_FROM,
                to: emailAddress,
                subject: `Your confirmation code: ${code}`,
                react: ConfirmationCode({ validationCode: code }),
                text: `Your confirmation code: ${code}`,
            });

            return error === null;
        }

        const transporter = getSmtpTransporter();
        const html = render(ConfirmationCode({ validationCode: code }));
        await transporter.sendMail({
            from: serverEnvs.EMAIL_FROM,
            to: emailAddress,
            subject: `Your confirmation code: ${code}`,
            html,
            text: `Your confirmation code: ${code}`,
        });

        return true;
    } catch {
        return false;
    }
}

export async function generateEmailVerificationCode(userId: string): Promise<string> {
    const existingCode = await db
        .select({ code: emailVerificationCodes.code, expiresAt: emailVerificationCodes.expiresAt })
        .from(emailVerificationCodes)
        .where(eq(emailVerificationCodes.userId, userId));

    if (existingCode.length > 0 && isWithinExpirationDate(existingCode[0]!.expiresAt)) {
        return existingCode[0]!.code;
    }

    const code = generateRandomString(8, alphabet('0-9'));
    if (existingCode.length > 0) {
        await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.userId, userId));
    }

    await db.insert(emailVerificationCodes).values({
        userId,
        code,
        expiresAt: createDate(new TimeSpan(5, 'm')),
    });

    return code;
}
