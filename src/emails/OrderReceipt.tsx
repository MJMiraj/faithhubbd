import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Preview,
  Hr,
  Section,
  Row,
  Column,
} from '@react-email/components';

interface OrderReceiptEmailProps {
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  items: { name: string; quantity: number; price: number; variant?: string | null }[];
}

export const OrderReceiptEmail = ({
  customerName,
  orderNumber,
  totalAmount,
  items,
}: OrderReceiptEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your Order Receipt from FaithHub BD - #{orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={logo}>FAITHHUB BD</Text>
          <Hr style={hr} />
          
          <Text style={heading}>Thank you for your order, {customerName}!</Text>
          <Text style={paragraph}>
            We have received your order <strong>#{orderNumber}</strong> and are getting it ready for shipment. 
            Below is a summary of your purchase.
          </Text>

          <Section style={orderSection}>
            <Text style={sectionTitle}>Order Summary</Text>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column>
                  <Text style={itemText}>
                    {item.quantity}x {item.name} {item.variant ? `(${item.variant})` : ''}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={itemText}>৳{item.price * item.quantity}</Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row>
              <Column>
                <Text style={totalText}>Total</Text>
              </Column>
              <Column align="right">
                <Text style={totalText}>৳{totalAmount}</Text>
              </Column>
            </Row>
          </Section>

          <Text style={paragraph}>
            If you have any questions, reply to this email or contact us on WhatsApp.
          </Text>
          
          <Link href="https://faithhub.bd" style={button}>
            Track Your Order
          </Link>
          
          <Text style={footer}>
            © {new Date().getFullYear()} FaithHub BD. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
};

const logo = {
  fontSize: '24px',
  fontWeight: '900',
  textAlign: 'center' as const,
  letterSpacing: '2px',
  color: '#000',
  marginBottom: '20px',
};

const heading = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#333',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '1.5',
  color: '#555',
};

const orderSection = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '15px',
  color: '#111',
};

const itemRow = {
  marginBottom: '10px',
};

const itemText = {
  fontSize: '14px',
  color: '#444',
  margin: '0',
};

const totalText = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#111',
  margin: '10px 0 0 0',
};

const hr = {
  borderColor: '#eaeaea',
  margin: '20px 0',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  marginTop: '20px',
};

const footer = {
  fontSize: '12px',
  color: '#888',
  textAlign: 'center' as const,
  marginTop: '40px',
};
