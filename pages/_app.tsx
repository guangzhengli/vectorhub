import '@/styles/globals.css';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import {SessionProvider} from "next-auth/react";

const inter = Inter({ subsets: ['latin'] });

function App({ Component, pageProps }: AppProps) {
  return (
    <main className={inter.className}>
      <SessionProvider session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </main>
  );
}

export default appWithTranslation(App);
