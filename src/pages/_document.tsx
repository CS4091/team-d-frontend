import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <style>{`
          html, body {
            background-color: #000000 !important;
          }
        `}</style>
      </Head>
      <body className="antialiased transition-none">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
