import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SecureRegent — Business Performance & Revenue Analytics Dashboard',
  description: 'Enterprise analytics dashboard tracking Leads, Quotations, Deals, Orders, and Revenue with normalized comparative period calculations, interactive conversion funnels, and 1:N relational drill-down architecture.',
  authors: [{ name: 'Yash Jain', url: 'https://github.com/yash560' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
