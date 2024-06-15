import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="icon" href="./favicon.png" />
          <title>TruEMI - See What's Really Behind Your EMIs!</title>
          <meta
            name="description"
            content="Uncover hidden fees, manage shared EMI transactions with ease, and fully understand your financial commitments with TruEMI. Experience clarity with each installment."
          />
          <meta
            name="keywords"
            content="EMI calculator, transparent EMI, hidden fees, TruEMI, financial clarity, Indian EMI calculator"
          />
          <meta
            property="og:title"
            content="TruEMI - See What's Really Behind Your EMIs!"
          />
          <meta
            property="og:description"
            content="Discover the true cost of your purchases with TruEMI. No hidden charges, no surprises—only clarity."
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:image"
            content="/images/emi-calculator-og-image.jpg"
          />
          <meta property="og:url" content="https://truemi.netlify.app" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="canonical" href="https://truemi.netlify.app" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
