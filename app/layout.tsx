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
import {
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_LOCALE,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  graph,
  jsonLdString,
  personSchema,
  websiteSchema,
} from "@/lib/seo";

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
  let settings: Awaited<ReturnType<typeof getSiteSettings>> = null;
  try {
    settings = await getSiteSettings();
  } catch {
    settings = null;
  }
  const description = settings?.siteDescription ?? SITE_DESCRIPTION;
  const ogImage = settings?.defaultOgImage?.asset.url;

  return {
    metadataBase: new URL(SITE_URL),
    alternates: { languages: { en: "/", "x-default": "/" } },
    title: {
      default: settings?.siteTitle ?? SITE_TITLE,
      template: `%s — ${SITE_NAME}`,
    },
    description,
    applicationName: SITE_NAME,
    keywords: SITE_KEYWORDS,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "technology",
    formatDetection: { email: false, address: false, telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: SITE_URL,
      title: settings?.siteTitle ?? SITE_TITLE,
      description,
      images: ogImage ? [{ url: ogImage, alt: SITE_TITLE }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: settings?.siteTitle ?? SITE_TITLE,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    verification: {
      google: "HfBXNpLNqLlROstqOfH-JOeN_Rk_VXq_dFDAhdKhSgw",
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const siteJsonLd = jsonLdString(
    graph(
      personSchema({
        sameAs: (settings?.socialLinks ?? [])
          .map((l) => l.url)
          .filter((u): u is string => Boolean(u) && /^https?:\/\//.test(u)),
        image: settings?.logo?.asset?.url ?? null,
        email: settings?.email ?? null,
      }),
      websiteSchema(),
    ),
  );

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: siteJsonLd }} />
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
