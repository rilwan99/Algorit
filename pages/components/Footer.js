export default function Footer() {
  return (
    <footer className="pb-4 text-gray-200">
      <div className="max-w-5xl xl:max-w-5xl mx-auto divide-y divide-gray-900 px-4 sm:px-6 md:px-8">
        <div className="container flex flex-col items-center justify-center mx-auto pt-5 pb-4 border-t lg:flex-row bg-top border-white">
          <p>
            Built exclusively for the Solana{" "}
            <a className=" hover:text-white font-semibold tr04" href="https://www.sandstormhackathon.com/">
              Sandstorm
            </a>
            {" "} Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
}
