import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

type ConfirmationCodeProps = {
    validationCode: string;
};

export default function ConfirmationCode({ validationCode }: ConfirmationCodeProps) {
    return (
        <Html>
            <Head>
                <title>Your confirmation code: {validationCode}</title>
            </Head>
            <Preview>Your confirmation code: {validationCode}</Preview>
            <Tailwind>
                <Body className='font-sans'>
                    <Container className='px-5'>
                        <Heading>Your confirmation code</Heading>
                        <Text className='text-xl'>
                            Here&apos;s the confirmation code you requested. Enter this code to
                            confirm your email.
                        </Text>

                        <Section className='rounded-md bg-gray-100 text-gray-950'>
                            <Text className='text-center align-middle font-mono text-3xl'>
                                {validationCode}
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}

ConfirmationCode.PreviewProps = {
    validationCode: '424-242',
} as ConfirmationCodeProps;
