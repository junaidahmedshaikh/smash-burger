import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/layout/CartDrawer';
import CustomizerModal from '@/components/customizer/CustomizerModal';

const syne = Syne({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-syne',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Smash Burger | Premium Smashed Burgers & Shakes",
  description:
    'Unapologetic flavor. Ultra-crispy double smashed Angus beef, aged Wisconsin cheddar, artisan scratch sauces, and milk brioche buns.',
  openGraph: {
    title: "Smash Burger",
    description: 'Crispy lace-edged 100% prime Angus smash burgers made to order.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${jakarta.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-brand-dark text-brand-cream antialiased selection:bg-brand-red selection:text-white flex flex-col min-h-screen overflow-x-hidden w-full">
        <Providers>
          <Navbar />
          <main className="flex-1 w-full overflow-x-hidden">{children}</main>
          <Footer />
          <CartDrawer />
          <CustomizerModal />
        </Providers>
      </body>
    </html>
  );
}
