import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import NavigationMenu from "@/components/navigation/navigation-menu";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Promptomoto",
    description: "Manage and share your AI prompts",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="h-full">
            <body
                className={`${geistSans.variable} ${geistMono.variable} bg-background flex h-full flex-col antialiased`}
            >
                <Providers>
                    <NavigationMenu />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
