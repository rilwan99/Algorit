import Head from "next/head";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="text-black bg-black">
      <Head>
        <title>Algorit</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
      <Footer />
    </div>
  );
}