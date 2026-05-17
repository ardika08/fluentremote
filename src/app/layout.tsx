import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getServerSession } from "@/lib/auth-server";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FluentRemote",
  description:
    "A modern frontend shell for FluentRemote, the translation assistant for remote client conversations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const session = await getServerSession();

  return (
    <html
      lang={locale}
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-foreground)]">
        <div className="relative flex min-h-screen flex-col">
          <SiteHeader
            locale={locale}
            dictionary={dictionary.header}
            switcher={dictionary.localeSwitch}
            auth={dictionary.auth.status}
            user={
              session?.user
                ? {
                    name: session.user.name,
                    email: session.user.email,
                  }
                : null
            }
          />
          {children}
          <SiteFooter dictionary={dictionary.footer} />
        </div>
      </body>
    </html>
  );
}
