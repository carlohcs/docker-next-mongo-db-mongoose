import Document, { Html, Head, Main, NextScript } from 'next/document';
import Header from '../src/components/header';
import Footer from '../src/components/footer';

// import { DEFAULT_LANG } from '../components/helpers/constants'

// https://github.com/zeit/next.js#custom-document

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Header />
          <Main />
          <Footer />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
