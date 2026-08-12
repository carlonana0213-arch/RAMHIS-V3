import {
  Building2,
  HeartHandshake,
  Hospital,
  Users,
  ArrowDown,
  ShieldCheck,
} from "lucide-react";

import LandingLayout from "../../Layout/LandingLayout";

import rambnr from "../../assets/images/rambnr.png";
import docH from "../../assets/images/docH.jpg";

export default function Organization() {
  return (
    <LandingLayout>
      <div className="overflow-hidden bg-slate-50">
        {/* =====================================================
                    HERO
                ====================================================== */}

        <section className="relative min-h-[720px] overflow-hidden">
          {/* Background Image */}

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${rambnr})`,
            }}
          />

          {/* Blue Overlay */}

          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-900/80 to-blue-900/45" />

          {/* Additional Glow */}

          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[140px]" />

          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[140px]" />

          {/* Hero Content */}

          <div className="relative z-10 mx-auto flex min-h-[720px] max-w-7xl items-center px-6 pb-20 pt-36 lg:px-10">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 backdrop-blur-md">
                <Building2 size={16} className="text-sky-300" />

                <span className="text-sm font-semibold text-sky-200">
                  About the Organization
                </span>
              </div>

              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
                Remote Area Medical
                <span className="block text-sky-300">Philippines</span>
              </h1>

              <p className="mt-7 max-w-2xl text-lg leading-8 text-blue-100 sm:text-xl">
                Remote Area Medical Philippines is a non-profit organization
                providing free medical, dental, and surgical services to
                underserved communities across the country.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#our-story"
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3.5 font-bold text-blue-950 shadow-xl shadow-sky-500/20 transition hover:bg-sky-300"
                >
                  Our Story
                  <ArrowDown size={18} />
                </a>

                <a
                  href="#impact"
                  className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                >
                  Our Impact
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Fade */}

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
        </section>

        {/* =====================================================
                    INTRO / STORY
                ====================================================== */}

        <section
          id="our-story"
          className="relative bg-slate-50 px-6 py-24 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Text */}

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Our Story
                </p>

                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                  Healthcare where it is
                  <span className="block text-blue-600">needed most.</span>
                </h2>

                <div className="mt-8 space-y-6 text-base leading-8 text-slate-600 sm:text-lg">
                  <p>
                    RAM’s journey in the Philippines began in 2013, when it
                    stepped in to assist in the aftermath of Typhoon Yolanda.
                    Among the volunteers was Dr. Heidi Sampanga, a pediatrician
                    trained in New York, whose experience on the ground sparked
                    a deep desire to make a lasting impact.
                  </p>

                  <p>
                    Witnessing the urgent need for better healthcare, Dr.
                    Sampanga returned to the Philippines with a mission: to
                    address disparities in healthcare access across the
                    country’s most remote and conflict-affected regions.
                  </p>

                  <p>
                    Today, RAM Philippines continues to expand its reach,
                    improving health outcomes for underserved communities
                    nationwide.
                  </p>
                </div>

                {/* Mission Highlight */}

                <div className="mt-10 rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-900/5">
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                      <HeartHandshake size={24} />
                    </div>

                    <div>
                      <h3 className="font-bold text-blue-950">
                        Serving underserved communities
                      </h3>

                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Bringing healthcare services closer to communities that
                        have limited access to care.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}

              <div className="relative">
                {/* Decorative background */}

                <div className="absolute -right-8 -top-8 h-64 w-64 rounded-full bg-blue-200/60 blur-3xl" />

                <div className="absolute -bottom-8 -left-8 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />

                <div className="relative overflow-hidden rounded-[32px] border border-white bg-white p-3 shadow-2xl shadow-blue-950/10">
                  <img
                    src={docH}
                    alt="Remote Area Medical Philippines"
                    className="h-[520px] w-full rounded-[24px] object-cover"
                  />
                </div>

                {/* Floating badge */}

                <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/20 bg-blue-950 px-6 py-5 shadow-2xl sm:block">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-sky-300" size={28} />

                    <div>
                      <p className="text-xs font-medium text-blue-200">Since</p>

                      <p className="text-xl font-bold text-white">2013</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
                    IMPACT
                ====================================================== */}

        <section
          id="impact"
          className="relative overflow-hidden bg-blue-950 px-6 py-24 lg:px-10 lg:py-28"
        >
          {/* Background decoration */}

          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[150px]" />

          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[150px]" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
                Our Impact
              </p>

              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                Making a measurable
                <span className="block text-sky-300">difference.</span>
              </h2>

              <p className="mt-5 text-blue-200">
                Every mission brings healthcare closer to communities that need
                it most.
              </p>
            </div>

            {/* Statistics */}

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <StatCard
                icon={<Hospital size={28} />}
                value="633"
                description="remote and disaster relief clinics held"
              />

              <StatCard
                icon={<Users size={28} />}
                value="45,000"
                description="patients served nationwide"
              />

              <StatCard
                icon={<HeartHandshake size={28} />}
                value="₱60M"
                description="worth of free medical care provided"
              />
            </div>
          </div>
        </section>

        {/* =====================================================
                    MISSION SECTION
                ====================================================== */}

        <section className="bg-white px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Our Commitment
                </p>

                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                  Bringing care beyond
                  <span className="block text-blue-600">
                    the usual boundaries.
                  </span>
                </h2>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <CommitmentCard
                  icon={<Hospital size={24} />}
                  title="Medical Missions"
                  text="Providing healthcare services in remote and underserved communities."
                />

                <CommitmentCard
                  icon={<Users size={24} />}
                  title="Community Focus"
                  text="Working directly with communities to improve access to essential care."
                />

                <CommitmentCard
                  icon={<HeartHandshake size={24} />}
                  title="Volunteer Driven"
                  text="Bringing together healthcare professionals and volunteers to serve."
                />

                <CommitmentCard
                  icon={<ShieldCheck size={24} />}
                  title="Sustainable Impact"
                  text="Building systems and practices that support continued healthcare delivery."
                />
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
                    CTA
                ====================================================== */}

        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950 px-6 py-24 lg:px-10">
          <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[100px]" />

          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
              RAMHIS
            </p>

            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Technology supporting
              <span className="block text-sky-300">healthcare missions.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-200">
              Discover how RAMHIS helps medical missions manage patient
              information, healthcare operations, and data more effectively.
            </p>

            <a
              href="/ramhis"
              className="mt-8 inline-flex items-center rounded-xl bg-sky-400 px-7 py-3.5 font-bold text-blue-950 shadow-xl shadow-sky-500/20 transition hover:bg-sky-300"
            >
              Explore RAMHIS
            </a>
          </div>
        </section>
      </div>
    </LandingLayout>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({ icon, value, description }) {
  return (
    <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:bg-white/10">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300 transition group-hover:bg-sky-400/20">
        {icon}
      </div>

      <h3 className="mt-7 text-5xl font-extrabold tracking-tight text-white">
        {value}
      </h3>

      <p className="mt-3 max-w-xs text-blue-200">{description}</p>
    </div>
  );
}

/* ============================================================
   COMMITMENT CARD
============================================================ */

function CommitmentCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-slate-50 p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-blue-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
    </div>
  );
}
