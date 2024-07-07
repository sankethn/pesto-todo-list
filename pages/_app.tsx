import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import type { AppProps } from 'next/app';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

const inter = Inter({ subsets: ['latin'] });

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}
    </style>
    <NextUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="dark">
        <Component className={inter.className} {...pageProps} />
      </NextThemesProvider>
    </NextUIProvider>
  </>
);

export default App;
