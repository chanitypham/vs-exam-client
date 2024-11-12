import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WebSocketProvider } from '@/components/WebSocketProvider';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "VsExam",
  description: "An extension to hold exams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SignedIn>
            <nav className="bg-gray-800 text-white p-4">
              <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">VsExam</Link>
                <div className="flex items-center space-x-4">
                  <Link href="/exams" className="hover:text-gray-300">Exams</Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </div>
            </nav>
            <WebSocketProvider>
              <main className="container mx-auto mt-8 px-4">{children}</main>
            </WebSocketProvider>
          </SignedIn>
          <SignedOut>
            <div className="flex flex-col items-center justify-center min-h-screen">
              <h1 className="text-3xl font-bold mb-4">Welcome to VsExam</h1>
              <SignInButton mode="modal">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
