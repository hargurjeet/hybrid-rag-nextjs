import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Research Assistant — Hybrid RAG",
  description:
    "Ask questions about arXiv research papers using hybrid retrieval-augmented generation.",
  openGraph: {
    title: "Research Assistant — Hybrid RAG",
    description:
      "Ask questions about arXiv research papers using hybrid retrieval-augmented generation.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Research Assistant — Hybrid RAG",
    description:
      "Ask questions about arXiv research papers using hybrid retrieval-augmented generation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased">
        {/* Applies saved theme before first paint — prevents light flash when dark is stored */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var r=document.documentElement,t=localStorage.getItem('theme');if(t==='dark'){r.classList.add('dark');}else{r.classList.remove('dark');r.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
