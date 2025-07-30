import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import AnimatedBackground from '@/components/animated-background';

export const metadata: Metadata = {
  title: 'PraktykanciHub',
  description: 'Aplikacja społecznościowa dla praktykantów.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{colorScheme: 'dark'}}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          <AnimatedBackground />
          <main id="root-main-content" className="relative z-10">
            {children}
          </main>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
