# Pending Tasks & Incomplete Work Checklist

This file contains a list of incomplete features, mocked services, and UI placeholders in the project. Any AI assistant can use this checklist to systematically implement the missing functionality.

## 💳 1. Payment Integration (Stripe)
- [x] **Remove Hardcoded Mock Keys:** In `src/app/api/webhooks/stripe/route.ts` and `src/app/checkout/actions.ts`, the Stripe client falls back to `'sk_test_mock'` and `'whsec_mock'`. These fallbacks should be removed to ensure the app fails safely if environment variables are missing.
- [x] **Configure Environment Variables:** Ensure `.env` contains valid `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET`.
- [x] **Test Webhook:** Verify that the Stripe webhook correctly updates database order statuses upon successful payment.

## 🚚 2. Courier & Shipping API
- [x] **Replace `MockCourierDriver`:** In `src/lib/courier.ts`, the `MockCourierDriver` generates a fake tracking number. Replace this with a real integration for your local courier (e.g., Pathao, Steadfast, or RedX API).
- [x] **API Credentials:** Add necessary courier API keys and secret tokens to the `.env` file.

## 📧 3. Email Delivery (Resend)
- [x] **Add Real Resend API Key:** Provide a valid `RESEND_API_KEY` in the `.env` file.
- [x] **Review Mock Fallback:** In `src/lib/email.ts`, if the API key is missing, it currently returns a simulated success response (`{ success: true, message: "Mock email sent" }`). Consider throwing an actual error in production so silent failures do not occur.

## 📊 4. Admin Dashboard (`src/app/admin/page.tsx`)
- [x] **Fix "Total Orders" Stat:** The "Total Orders" metric (line 15) is hardcoded to `0`. Update this to fetch the actual order count from the Prisma database (`db.order.count()`).
- [x] **Implement Revenue Chart:** Replace the `"Chart rendering placeholder"` text with an actual charting library (like `recharts` or `chart.js`) that pulls real revenue data from the database.
- [x] **Implement Recent Activity Feed:** The "Recent Activity" list (New Orders, New Customers, Stock Updates) is completely hardcoded dummy data. Create a unified database query to fetch the latest real activities.

## 🎨 5. UI Placeholders
- [x] **Dynamic Mega Menu Images:** In `src/components/layout/Navbar.tsx`, the images shown under the "New Arrivals" mega menu dropdown are hardcoded Unsplash URLs. Update this to fetch and display the actual featured product/category images from the database.
- [x] **Admin Reviews Product Images:** In `src/app/admin/reviews/page.tsx`, implement the actual product image thumbnail where the `{/* Placeholder for Product Image */}` comment currently resides.
