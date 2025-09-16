import type { Metadata } from 'next';
import '../styles/globals.css';
import Link from 'next/link';
import AmplifyProvider from '@/components/AmplifyProvider';
import { Inter } from 'next/font/google';

export const metadata: Metadata = {
  title: 'Linkfolio',
  description: 'Create, share, and customize your digital card and links.'
};

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06b6d4" />
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
  <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
  <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
        <meta property="og:title" content="Linkfolio" />
        <meta property="og:description" content="Create, share, and customize your digital card and links." />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="/og-image.png" />
  <meta name="twitter:image" content="/og-image.png" />
        <meta name="twitter:card" content="summary" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen`} suppressHydrationWarning>
        <AmplifyProvider>
          <header className="w-full border-b border-black/10 dark:border-white/10">
            <div className="mx-auto max-w-5xl flex items-center justify-between p-4">
              <Link href="/" className="font-semibold">Linkfolio</Link>
              <nav className="flex items-center gap-3 text-sm">
                <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                <Link href="/login" className="hover:underline">Login</Link>
              </nav>
            </div>
          </header>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  );
}
