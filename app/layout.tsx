import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import BootScreen from "@/components/boot-screen";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import GlobalTerminal from "@/components/global-terminal/global-terminal";
import ScrollToTop from "@/components/scroll-to-top";
import { getSiteSettings } from "@/lib/site-settings";
import StoreProvider from "@/components/store-provider";
import "./globals.css";
import Script from "next/script";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"], 
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    // title: {
    //   default: settings?.siteTitle ?? settings?.siteName ?? "Hamza Elmouddane — Backend & AI Engineer",
    //   template: `%s — ${settings?.siteName ?? "Hamza Elmouddane"}`,
    // },

    // description:
    //   settings?.siteDescription ??
    //   "Backend & AI Engineer based in Morocco. NestJS · FastAPI · Go · TypeScript. I build systems. I ship backends. I engineer the invisible.",
    // openGraph: settings?.defaultOgImage?.asset.url
    //   ? { images: [{ url: settings.defaultOgImage.asset.url }] }
    //   : undefined,
      
    verification: {
      google: "HfBXNpLNqLlROstqOfH-JOeN_Rk_VXq_dFDAhdKhSgw",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
      
    >
      <head>
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtm.js?id=GTM-587RRV5P"
        />

        <Script id="google-tag-manager-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
          `}
        </Script>
      </head>
      
      <body className="flex min-h-full flex-col">
        <StoreProvider settings={settings}>
          <BootScreen />
          <ScrollToTop />
          <GlobalTerminal settings={settings} />
          <Navbar navigation={settings?.navigation ?? []} />
          <main className="flex-1">{children}</main>
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
