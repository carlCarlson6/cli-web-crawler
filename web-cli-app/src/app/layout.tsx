import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Provider } from "~/ui/components/ui/provider";
import { ClerkProvider } from '@clerk/nextjs'
import { TRPCReactProvider } from "~/ui/react";

export const metadata: Metadata = {
  title: "dungeon-cli",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={geist.className}>
          <Provider>
            <TRPCReactProvider>
              {children}
            </TRPCReactProvider>
          </Provider>
        </body>
      </html>
    </ClerkProvider>
  );
}
