import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { TopNav } from '@/components/layout/top-nav';
import { QueryProvider } from '@/components/layout/query-provider';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: 'BrowserScan.org — Authority Grade Scan',
	description: 'Cyber-Industrial browser intelligence terminal delivering JA3/JA4, risk scoring, and PDF diagnostics.',
	metadataBase: new URL('https://browserscan.org'),
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<QueryProvider>
					<div className="min-h-screen bg-[#09090b] text-zinc-100">
						<TopNav />
						<main>{children}</main>
					</div>
				</QueryProvider>
			</body>
		</html>
	);
}
