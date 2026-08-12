import LandingLayout from "../../Layout/LandingLayout";

export default function Home() {
  return (
    <LandingLayout>
      <section className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 pt-32">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-20 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-5 inline-flex rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 text-sm font-semibold text-sky-300 backdrop-blur-md">
              Remote Area Medical Philippines
            </p>

            <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Healthcare
              <span className="block text-sky-300">without limits.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">
              RAMHIS is a healthcare information system designed to support
              medical missions through secure records, offline-first operations,
              and intelligent analytics.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/ramhis"
                className="rounded-xl bg-sky-400 px-6 py-3.5 font-bold text-blue-950 shadow-xl shadow-sky-500/20 transition hover:bg-sky-300"
              >
                Explore RAMHIS
              </a>

              <a
                href="/organization"
                className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                About the Organization
              </a>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
