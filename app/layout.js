import { Inter, Roboto_Mono } from 'next/font/google';
import React from 'react';
import { ClientProviders } from '../lib/Providers';

export async function generateMetadata({ params }) {
  
  return {
    title: 'Dota Timings',
    description: 'Dota Timings is a tool that helps you track your Dota 2 game timings.',
    manifest: '/site.webmanifest',
    icons: {
      icon: '/icon.ico',
      shortcut: '/favicon.ico',
    },
    openGraph: {
      title: 'Dota Timings',
      description: 'Dota Timings is a tool that helps you track your Dota 2 game timings.',
      url: 'https://dotatimings.com',
      siteName: 'Dota Timings',
      images: [
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        site: '@dotatimings',
    },
    robots: {
        index: true,
        follow: true,
    },
    metadataBase: new URL('https://dotatimings.com'),
  };
}
  
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
});

export default async function RootLayout({ children }) {  
    return (
        <html>     
            <head>
                <script src="https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js" data-cfasync="false" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css" rel="stylesheet" />
            </head>
            <body className={`${inter.variable} ${robotoMono.variable}`}>                
                <ClientProviders>
                    <div className="App container-fluid">
                        <div className="row main-content-row g-0">
                            <div className="col main-content-col">
                                {children}
                            </div>
                        </div>
                    </div>
                </ClientProviders>
            </body>
        </html>
    );
}
