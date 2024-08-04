import { Body, Container, Head, Heading, Html, Preview, Section, Text } from 'jsx-email';

interface ConfirmationCodeProps {
    validationCode: string;
}

export const PreviewProps = {
    validationCode: '424-242',
} as ConfirmationCodeProps;

export const TemplateName = 'Airbnb Review';

export const Template = ({ validationCode }: ConfirmationCodeProps) => (
    <Html>
        <Head />
        <Preview>Your confirmation code</Preview>
        <Body style={main}>
            <Container style={container}>
                <Heading style={h1}>Your confirmation code</Heading>
                <Text style={heroText}>
                    Here&apos;s the confirmation code you requested. Enter this code to confirm your
                    email.
                </Text>

                <Section style={codeBox}>
                    <Text style={confirmationCodeText}>{validationCode}</Text>
                </Section>
            </Container>
        </Body>
    </Html>
);

const main: React.CSSProperties = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container: React.CSSProperties = {
    margin: '0 auto',
    padding: '0px 20px',
};

const h1: React.CSSProperties = {
    color: '#1d1c1d',
    fontSize: '36px',
    fontWeight: '700',
    margin: '30px 0',
    padding: '0',
    lineHeight: '42px',
};

const heroText: React.CSSProperties = {
    fontSize: '20px',
    lineHeight: '28px',
    marginBottom: '30px',
};

const codeBox: React.CSSProperties = {
    background: 'rgb(245, 244, 245)',
    borderRadius: '4px',
    marginBottom: '30px',
    padding: '40px 10px',
};

const confirmationCodeText: React.CSSProperties = {
    fontSize: '30px',
    textAlign: 'center' as const,
    verticalAlign: 'middle',
};
