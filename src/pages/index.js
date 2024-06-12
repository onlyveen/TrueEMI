// pages/index.js

import Head from "next/head";
import EMICalculator from "../components/EMICalculator";

export default function Home() {
  return (
    <div>
      <Head>
        <title>EMI Calculator</title>
        <meta name="description" content="EMI Calculator App" />
      </Head>
      <main>
        <EMICalculator />
      </main>
    </div>
  );
}
