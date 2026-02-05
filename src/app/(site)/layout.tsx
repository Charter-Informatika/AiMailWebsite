"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { inter } from "@/lib/fonts";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import React from "react";
import "../../css/animate.css";
import "../../css/style.css";
import AuthProvider from "../context/AuthContext";
import ToasterContext from "../context/ToastContext";
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon-v2.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <NextTopLoader
          color="#006BFF"
          crawlSpeed={300}
          showSpinner={false}
          shadow="none"
        />

        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="light"
        >
          <div className="isolate flex min-h-screen flex-col">
            <AuthProvider>
              <Header />
              <div className="isolate flex-grow">{children}</div>
              <Footer />
            </AuthProvider>
          </div>

          <ToasterContext />
          <ScrollToTop />
        </ThemeProvider>
        <Analytics />

        {/* Statcounter: inline config + external script + noscript fallback */}
        <Script
          id="statcounter-inline"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `var sc_project=13168723; var sc_invisible=1; var sc_security="4634ba31";`,
          }}
        />
        <Script
          src="https://www.statcounter.com/counter/counter.js"
          strategy="afterInteractive"
        />

        <noscript>
          <div className="statcounter">
            <a
              title="látogató számláló"
              href="https://www.statcounter.hu/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                className="statcounter"
                src="https://c.statcounter.com/13168723/0/4634ba31/1/"
                alt="látogató számláló"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </a>
          </div>
        </noscript>
      </body>
    </html>
  );
}
