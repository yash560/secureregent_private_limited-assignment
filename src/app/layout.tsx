import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://secureregentprivatelimited.vercel.app'),
  title: 'SecureRegent — Enterprise Revenue & Business Performance Analytics Dashboard',
  description:
    'Enterprise analytics dashboard tracking Leads, Quotations, Deals, Orders, and Revenue with normalized comparative period calculations, interactive conversion funnels, and 1:N relational drill-down architecture. Powered by TheWebVale.',
  keywords: [
    'SecureRegent',
    'Business Performance Dashboard',
    'Revenue Analytics',
    'Conversion Funnel',
    'Deal Flow Management',
    'Enterprise CRM Analytics',
    'TheWebVale',
    'Next.js 15',
    'React 19',
  ],
  authors: [{ name: 'SecureRegent & TheWebVale' }],
  creator: 'TheWebVale',
  publisher: 'SecureRegent Private Limited',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://secureregentprivatelimited.vercel.app',
    siteName: 'SecureRegent Revenue Analytics',
    title: 'SecureRegent — Revenue & Performance Analytics | Powered by TheWebVale',
    description:
      'Executive telemetry dashboard tracking Leads, Quotations, Won Deals, and Collections with 1:N relational drill-down and interactive conversion funnels.',
    images: [
      {
        url: 'https://secureregentprivatelimited.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SecureRegent Business Analytics Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SecureRegent — Enterprise Revenue Analytics | Powered by TheWebVale',
    description:
      'Leads, quotes, deals, and fulfillment analytics with real-time conversion telemetry. Powered by TheWebVale.',
    images: ['https://secureregentprivatelimited.vercel.app/og-image.png'],
    creator: '@TheWebVale',
  },
  alternates: {
    canonical: 'https://secureregentprivatelimited.vercel.app',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🛡️</text></svg>" />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
