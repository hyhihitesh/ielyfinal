import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteFooter } from "@/components/site-footer";
import { BottomNav } from "@/components/mobile/bottom-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://piely.app'),
  title: {
    default: "Piely - AI-Powered Startup Guidance",
    template: "%s | Piely",
  },
  description: "Your personalized startup roadmap that evolves as you grow. Get AI-powered contextual advice for every stage of your startup journey.",
  keywords: ["startup", "roadmap", "AI co-founder", "business planner", "accelerator"],
  authors: [{ name: "Piely Team" }],
  creator: "Piely",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Piely - AI-Powered Startup Guidance",
    description: "Launch your startup with confidence using Piely's adaptive roadmap.",
    siteName: "Piely",
    images: [
      {
        url: "/og-image.png", // We will create a default OG image or use a placeholder
        width: 1200,
        height: 630,
        alt: "Piely Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piely - AI-Powered Startup Guidance",
    description: "Your personalized startup roadmap that evolves as you grow.",
    images: ["/og-image.png"],
    creator: "@pielyapp",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <BottomNav />
          {/* GlobalChat removed - now embedded in dashboard sidebar */}
          <SiteFooter />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Piely",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "AI-Powered Startup Guidance and Roadmap Platform",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "100"
              }
            })
          }}
        />
      </body>
    </html>
  );
}
