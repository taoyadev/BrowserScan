import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
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
	title: 'BrowserScan — Browser Trust Score Analysis',
	description: 'Advanced browser fingerprinting and trust score analysis. Detect bots, leaks, and spoofing with JA3/JA4, WebRTC detection, and comprehensive diagnostics.',
	metadataBase: new URL('https://browserscan.org'),
	keywords: ['browser fingerprint', 'trust score', 'bot detection', 'webrtc leak', 'ip lookup', 'fingerprint analysis'],
	openGraph: {
		title: 'BrowserScan — Browser Trust Score Analysis',
		description: 'Advanced browser fingerprinting and trust score analysis. Detect bots, leaks, and spoofing.',
		type: 'website',
		siteName: 'BrowserScan',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'BrowserScan — Browser Trust Score Analysis',
		description: 'Advanced browser fingerprinting and trust score analysis.',
	},
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
					<div className="flex min-h-screen flex-col bg-[#09090b] text-zinc-100">
						<Header />
						<main className="flex-1">{children}</main>
						<Footer />
					</div>
				</QueryProvider>
			</body>
		</html>
	);
}
