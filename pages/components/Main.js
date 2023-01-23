export default function Main() {
  return (
    <section className="text-gray-600 body-font">
      <div className="max-w-5xl pt-32 pb-5 mx-auto">
        <h1 className="text-80 text-center font-4 lh-6 ld-04 font-bold text-white mb-6">
          NFT Transaction Explorer
        </h1>
        <div className="flex justify-center -mb-10">
          <div className="w-1/2 -m-10">
            <img
              className="object-cover"
              alt="Placeholder Image"
              src="/logo-white.svg"
            ></img>
          </div>
          <div className="w-1/4 pt-40">
            <h2 className="text-2xl font-4 font-semibold lh-6 ld-04 pb-6 text-white text-center">
              Transactions made
            </h2>
            <h2 className="text-2xl font-4 font-bold lh-6 ld-04 pb-2 text-blue-600 text-center">
              Readable
            </h2>
            <h2 className="text-2xl font-4 font-bold lh-6 ld-04 pb-2 text-blue-600 text-center">
              Understandable
            </h2>
            <h2 className="text-2xl font-4 font-bold lh-6 ld-04 pb-11 text-blue-600 text-center">
              Simple
            </h2>
          </div>
        </div>

        <div className="ml-6 text-center">
          <h3 className="text-1xl font-4 font-semibold lh-6 ld-04 text-gray-600 text-center">
            Powered By
          </h3>
          <div className="flex justify-center w-1/4 mx-auto">
            <a
              href="https://helius.xyz/"
            >
              <div>
                <img src="/helius-labs.png" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
