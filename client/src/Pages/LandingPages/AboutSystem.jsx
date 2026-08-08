import {
  Activity,
  BarChart3,
  Database,
  HeartPulse,
  Laptop,
  Smartphone,
  WifiOff,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import LandingLayout from "../../Layout/LandingLayout";

import ramhisLogo from "../../assets/images/ramhislogo.png";
import mockup from "../../assets/images/mockup.png";
import mobilebg from "../../assets/images/mobilebg.png";
import hr from "../../assets/images/hr.png";
import ol from "../../assets/images/ol.png";
import anl from "../../assets/images/anl.png";

export default function AboutSystem() {
  return (
    <LandingLayout>
      <div className="overflow-hidden bg-slate-50">
        {/* =========================================================
            HERO
        ========================================================== */}

        <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-32">
          {/* Background glow */}

          <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[150px]" />

          <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-blue-500/20 blur-[150px]" />

          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-50 to-transparent" />

          <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid min-h-[720px] items-center gap-16 py-20 lg:grid-cols-2">
              {/* Hero text */}

              <div className="max-w-2xl">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-sky-300/20 bg-sky-400/10 px-4 py-2 backdrop-blur-md">
                  <HeartPulse size={17} className="text-sky-300" />

                  <span className="text-sm font-semibold text-sky-200">
                    About RAMHIS
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={ramhisLogo}
                    alt="RAMHIS"
                    className="h-16 w-auto object-contain"
                  />

                  <div>
                    <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                      RAMHIS
                    </p>

                    <p className="mt-1 text-sm font-medium text-blue-200">
                      Remote Area Medical Health Information System
                    </p>
                  </div>
                </div>

                <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                  Healthcare information
                  <span className="block text-sky-300">
                    wherever it is needed.
                  </span>
                </h1>

                <p className="mt-7 max-w-xl text-lg leading-8 text-blue-100 sm:text-xl">
                  A progressive web and mobile healthcare platform designed to
                  support medical missions, patient management, medical records,
                  and healthcare analytics.
                </p>

                <div className="mt-9 flex flex-wrap gap-4">
                  <a
                    href="#mobile"
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-6 py-3.5 font-bold text-blue-950 shadow-xl shadow-sky-500/20 transition hover:bg-sky-300"
                  >
                    Explore the System
                    <ArrowRight size={18} />
                  </a>

                  <a
                    href="#features"
                    className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
                  >
                    Key Features
                  </a>
                </div>
              </div>

              {/* Hero visual */}

              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute h-[420px] w-[420px] rounded-full bg-sky-400/10 blur-[100px]" />

                <div className="relative w-full max-w-xl">
                  <div className="absolute inset-0 rounded-[40px] bg-blue-500/20 blur-2xl" />

                  <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-white/5 p-5 shadow-2xl backdrop-blur-md">
                    <img
                      src={mockup}
                      alt="RAMHIS system interface"
                      className="relative z-10 mx-auto max-h-[520px] w-auto max-w-full object-contain"
                    />
                  </div>

                  {/* Floating information card */}

                  <div className="absolute -bottom-6 -left-3 hidden rounded-2xl border border-white/10 bg-blue-950/90 p-5 shadow-2xl backdrop-blur-xl sm:block">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                        <WifiOff size={22} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-white">
                          Offline First
                        </p>

                        <p className="mt-1 text-xs text-blue-200">
                          Built for portability
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            WHAT IS RAMHIS
        ========================================================== */}

        <section className="bg-slate-50 px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                The Platform
              </p>

              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                One system for
                <span className="block text-blue-600">
                  connected healthcare.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                RAMHIS brings together the tools needed to organize patient
                information and support healthcare operations across medical
                missions.
              </p>
            </div>

            <div className="mt-16 grid gap-6 md:grid-cols-3">
              <PlatformCard
                icon={<Smartphone size={25} />}
                title="Mobile"
                text="Support healthcare teams with a portable mobile platform designed for use during missions."
              />

              <PlatformCard
                icon={<Laptop size={25} />}
                title="Web"
                text="Provide centralized access to healthcare information and system management."
              />

              <PlatformCard
                icon={<BarChart3 size={25} />}
                title="Analytics"
                text="Turn collected healthcare data into information that can support planning and decision-making."
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            MOBILE APP
        ========================================================== */}

        <section
          id="mobile"
          className="relative overflow-hidden bg-white px-6 py-24 lg:px-10 lg:py-32"
        >
          <div className="absolute -right-40 top-20 h-[500px] w-[500px] rounded-full bg-blue-100/70 blur-[130px]" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Image */}

              <div className="relative order-2 flex justify-center lg:order-1">
                <div className="absolute h-[400px] w-[400px] rounded-full bg-blue-100 blur-[100px]" />

                <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-950 to-blue-800 p-8 shadow-2xl shadow-blue-950/15">
                  <img
                    src={mobilebg}
                    alt="RAMHIS mobile application"
                    className="mx-auto max-h-[560px] w-auto max-w-full object-contain"
                  />
                </div>
              </div>

              {/* Text */}

              <div className="order-1 lg:order-2">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Mobile Application
                </p>

                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                  Healthcare tools
                  <span className="block text-blue-600">in the field.</span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  The RAMHIS mobile application is designed to support
                  healthcare workers during medical missions, giving them access
                  to important patient and mission information while working in
                  the field.
                </p>

                <div className="mt-9 space-y-5">
                  <FeatureRow
                    icon={<Stethoscope size={20} />}
                    title="Patient Tracking"
                    text="Help healthcare teams keep track of patients throughout a mission."
                  />

                  <FeatureRow
                    icon={<Database size={20} />}
                    title="Medical Records"
                    text="Provide access to relevant patient information collected during healthcare activities."
                  />

                  <FeatureRow
                    icon={<Activity size={20} />}
                    title="Reports"
                    text="Support the collection and organization of information from medical missions."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            WEB SYSTEM
        ========================================================== */}

        <section className="relative overflow-hidden bg-blue-950 px-6 py-24 lg:px-10 lg:py-32">
          <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/20 blur-[150px]" />

          <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-sky-400/10 blur-[150px]" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              {/* Text */}

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
                  Web System
                </p>

                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                  A centralized
                  <span className="block text-sky-300">
                    healthcare platform.
                  </span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-blue-200">
                  The RAMHIS web system provides centralized access to patient
                  records and healthcare information, helping medical missions
                  organize and manage their data more efficiently.
                </p>

                <div className="mt-9 space-y-5">
                  <DarkFeature
                    icon={<Database size={21} />}
                    title="Centralized Records"
                    text="Organize patient information in one accessible system."
                  />

                  <DarkFeature
                    icon={<ShieldCheck size={21} />}
                    title="Information Management"
                    text="Support structured management of healthcare information."
                  />

                  <DarkFeature
                    icon={<BarChart3 size={21} />}
                    title="Analytics"
                    text="Use collected data to better understand healthcare activity."
                  />
                </div>
              </div>

              {/* Image */}

              <div className="relative">
                <div className="absolute inset-0 rounded-[40px] bg-sky-400/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-md">
                  <img
                    src={hr}
                    alt="RAMHIS web system"
                    className="w-full rounded-2xl object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            FEATURES
        ========================================================== */}

        <section
          id="features"
          className="bg-slate-50 px-6 py-24 lg:px-10 lg:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                Core Features
              </p>

              <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                Built around the needs
                <span className="block text-blue-600">
                  of medical missions.
                </span>
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-600">
                RAMHIS combines patient information, offline capabilities, and
                analytics into one healthcare information system.
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              <SystemFeatureCard
                image={ol}
                icon={<Database size={24} />}
                title="Patient Records"
                text="Manage and organize patient information to support healthcare teams throughout medical missions."
              />

              <SystemFeatureCard
                image={hr}
                icon={<WifiOff size={24} />}
                title="Offline System"
                text="Support medical missions in locations where reliable internet connectivity may not always be available."
              />

              <SystemFeatureCard
                image={anl}
                icon={<BarChart3 size={24} />}
                title="Predictive Analytics"
                text="Use healthcare data and analytics to help support planning and better understand future mission needs."
              />
            </div>
          </div>
        </section>

        {/* =========================================================
            OFFLINE FIRST
        ========================================================== */}

        <section className="bg-white px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 shadow-2xl shadow-blue-950/15">
              <div className="grid items-center lg:grid-cols-2">
                <div className="p-8 sm:p-12 lg:p-16">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
                    <WifiOff size={28} />
                  </div>

                  <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-sky-300">
                    Designed for the Field
                  </p>

                  <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    Offline first.
                    <span className="block text-sky-300">
                      Built for portability.
                    </span>
                  </h2>

                  <p className="mt-6 text-lg leading-8 text-blue-200">
                    RAMHIS is designed around the realities of remote healthcare
                    missions, where connectivity cannot always be guaranteed.
                  </p>

                  <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-white">
                    <ShieldCheck size={20} className="text-sky-300" />
                    Designed with remote medical missions in mind
                  </div>
                </div>

                <div className="flex min-h-[400px] items-center justify-center bg-white/5 p-8">
                  <img
                    src={mockup}
                    alt="RAMHIS portable healthcare system"
                    className="max-h-[400px] w-auto max-w-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            ANALYTICS
        ========================================================== */}

        <section className="bg-slate-50 px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <div className="relative">
                <div className="absolute -inset-10 rounded-full bg-blue-100/60 blur-[100px]" />

                <div className="relative overflow-hidden rounded-[32px] border border-blue-100 bg-white p-5 shadow-xl shadow-blue-950/5">
                  <img
                    src={anl}
                    alt="RAMHIS predictive analytics"
                    className="w-full object-contain"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
                  Data & Analytics
                </p>

                <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-blue-950 sm:text-5xl">
                  From healthcare data
                  <span className="block text-blue-600">
                    to useful insights.
                  </span>
                </h2>

                <p className="mt-6 text-lg leading-8 text-slate-600">
                  RAMHIS incorporates predictive analytics to help transform
                  historical healthcare information into insights that can
                  support future planning and medical mission preparation.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <SmallFeature
                    icon={<BarChart3 size={20} />}
                    title="Data Analysis"
                  />

                  <SmallFeature
                    icon={<Activity size={20} />}
                    title="Trend Insights"
                  />

                  <SmallFeature
                    icon={<HeartPulse size={20} />}
                    title="Healthcare Focus"
                  />

                  <SmallFeature
                    icon={<ArrowRight size={20} />}
                    title="Future Planning"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            CTA
        ========================================================== */}

        <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-950 px-6 py-24 lg:px-10">
          <div className="absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-sky-400/10 blur-[100px]" />

          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />

          <div className="relative z-10 mx-auto max-w-4xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-400/10 text-sky-300">
              <HeartPulse size={30} />
            </div>

            <h2 className="mt-7 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Technology that supports
              <span className="block text-sky-300">healthcare missions.</span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-200">
              RAMHIS brings together patient information, healthcare operations,
              offline capabilities, and analytics into one platform.
            </p>

            <a
              href="/login"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sky-400 px-7 py-3.5 font-bold text-blue-950 shadow-xl shadow-sky-500/20 transition hover:bg-sky-300"
            >
              Sign In to RAMHIS
              <ArrowRight size={18} />
            </a>
          </div>
        </section>
      </div>
    </LandingLayout>
  );
}

/* =============================================================
   PLATFORM CARD
============================================================= */

function PlatformCard({ icon, title, text }) {
  return (
    <div className="group rounded-3xl border border-blue-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/5">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20 transition group-hover:bg-blue-700">
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-bold text-blue-950">{title}</h3>

      <p className="mt-3 leading-7 text-slate-500">{text}</p>
    </div>
  );
}

/* =============================================================
   FEATURE ROW
============================================================= */

function FeatureRow({ icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-blue-950">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/* =============================================================
   DARK FEATURE
============================================================= */

function DarkFeature({ icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
        {icon}
      </div>

      <div>
        <h3 className="font-bold text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-blue-200">{text}</p>
      </div>
    </div>
  );
}

/* =============================================================
   SYSTEM FEATURE CARD
============================================================= */

function SystemFeatureCard({ image, icon, title, text }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-950/10">
      <div className="flex h-64 items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 to-slate-100 p-8">
        <img
          src={image}
          alt={title}
          className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          {icon}
        </div>

        <h3 className="mt-5 text-2xl font-bold text-blue-950">{title}</h3>

        <p className="mt-3 leading-7 text-slate-500">{text}</p>
      </div>
    </div>
  );
}

/* =============================================================
   SMALL FEATURE
============================================================= */

function SmallFeature({ icon, title }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-white px-4 py-4">
      <div className="text-blue-600">{icon}</div>

      <span className="text-sm font-semibold text-blue-950">{title}</span>
    </div>
  );
}
