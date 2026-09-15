import * as React from 'react';

interface AbandonedCartEmailProps {
  customerName: string;
  checkoutUrl: string;
}

export const AbandonedCartEmail: React.FC<Readonly<AbandonedCartEmailProps>> = ({
  customerName,
  checkoutUrl,
}) => (
  <div style={{ fontFamily: 'sans-serif', color: '#111' }}>
    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>You left something behind!</h1>
    <p style={{ fontSize: '16px' }}>Hi {customerName},</p>
    <p style={{ fontSize: '16px' }}>
      We noticed you left some great items in your shopping cart. As a special treat, use code <strong>COMEBACK5</strong> at checkout for 5% off your order!
    </p>
    <div style={{ marginTop: '30px', marginBottom: '30px' }}>
      <a href={checkoutUrl} style={{ backgroundColor: '#000', color: '#fff', padding: '12px 24px', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
        Complete Your Order
      </a>
    </div>
    <p style={{ fontSize: '14px', color: '#666' }}>
      If you have any questions or need help, just reply to this email.
    </p>
  </div>
);
