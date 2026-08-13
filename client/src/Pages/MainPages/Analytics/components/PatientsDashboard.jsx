import { useMemo, useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

import { apiFetch } from "../../services/api";

import {
  FiUsers,
  FiFileText,
  FiActivity,
} from "react-icons/fi";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const bluePalette = [
  "#1e3a8a",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

const PatientsDashboard = ({ patients = [] }) => {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const data = await apiFetch(
          "http://localhost:5000/api/prescriptions",
        );

        setPrescriptions(
          Array.isArray(data) ? data : [],
        );
      } catch (err) {
        console.error(
          "Failed to load prescriptions",
          err,
        );
      }
    };

    loadPrescriptions();
  }, []);

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "bottom",

        labels: {
          usePointStyle: true,
          padding: 16,
          boxWidth: 8,
          color: "#64748b",
          font: {
            size: 11,
            weight: "600",
          },
        },
      },

      tooltip: {
        backgroundColor: "#0f172a",
        padding: 12,
        cornerRadius: 10,
        titleFont: {
          size: 12,
          weight: "700",
        },
        bodyFont: {
          size: 12,
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 10,
            weight: "600",
          },
        },
      },

      y: {
        beginAtZero: true,
        grid: {
          color: "#e2e8f0",
        },
        ticks: {
          color: "#64748b",
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const stats = useMemo(
    () => ({
      totalPatients: patients.length,

      activePrescriptions:
        prescriptions.length,

      averageAge: Math.round(
        patients.reduce(
          (acc, p) =>
            acc +
            Number(p.generalInfo?.age || 0),
          0,
        ) /
          (patients.length || 1),
      ),
    }),
    [patients, prescriptions],
  );

  const ageSexData = useMemo(() => {
    const groups = {
      "0-12": { M: 0, F: 0 },
      "13-19": { M: 0, F: 0 },
      "20-35": { M: 0, F: 0 },
      "36-60": { M: 0, F: 0 },
      "60+": { M: 0, F: 0 },
    };

    patients.forEach((p) => {
      const age = Number(p.generalInfo?.age);

      const sex = (
        p.generalInfo?.gender ||
        p.generalInfo?.sex
      )
        ?.trim()
        ?.charAt(0)
        ?.toUpperCase();

      if (!age || !sex) return;

      const group =
        age <= 12
          ? "0-12"
          : age <= 19
            ? "13-19"
            : age <= 35
              ? "20-35"
              : age <= 60
                ? "36-60"
                : "60+";

      if (groups[group]) {
        if (sex === "M") groups[group].M++;
        if (sex === "F") groups[group].F++;
      }
    });

    return {
      labels: Object.keys(groups),

      datasets: [
        {
          label: "Male",
          data: Object.values(groups).map(
            (g) => g.M,
          ),
          backgroundColor: "#1d4ed8",
          borderRadius: 5,
          maxBarThickness: 34,
        },

        {
          label: "Female",
          data: Object.values(groups).map(
            (g) => g.F,
          ),
          backgroundColor: "#60a5fa",
          borderRadius: 5,
          maxBarThickness: 34,
        },
      ],
    };
  }, [patients]);

  const diagnosisData = useMemo(() => {
    const count = {};

    patients.forEach((p) => {
      const diag =
        p.doctorSheets?.[
          p.doctorSheets.length - 1
        ]?.diagnosis ||
        p.medicalInfo?.diagnosis;

      if (diag) {
        count[diag] =
          (count[diag] || 0) + 1;
      }
    });

    const sorted = Object.entries(count)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      labels: sorted.map((d) => d[0]),

      datasets: [
        {
          data: sorted.map((d) => d[1]),
          backgroundColor: bluePalette,
          borderWidth: 3,
          borderColor: "#ffffff",
          hoverOffset: 5,
        },
      ],
    };
  }, [patients]);

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold tracking-[0.12em] text-blue-700">
          PATIENT ANALYTICS
        </span>

        <h2 className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">
          Patient Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Summary of patient demographics and prescription activity.
        </p>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        <AnalyticsStatCard
          label="Total Patients"
          value={stats.totalPatients}
          description="Registered patient records"
          icon={<FiUsers />}
          iconClass="bg-blue-50 text-blue-700"
        />

        <AnalyticsStatCard
          label="Active Prescriptions"
          value={stats.activePrescriptions}
          description="Prescription records"
          icon={<FiFileText />}
          iconClass="bg-sky-50 text-sky-700"
        />

        <AnalyticsStatCard
          label="Average Patient Age"
          value={`${stats.averageAge} yrs`}
          description="Average recorded age"
          icon={<FiActivity />}
          iconClass="bg-indigo-50 text-indigo-700"
        />
      </div>

      {/* =====================================================
          CHARTS
      ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">

        {/* AGE / SEX */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h3 className="text-base font-extrabold text-slate-900">
              Demographics by Age & Sex
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Patient distribution across age groups.
            </p>
          </div>

          <div className="h-[340px] p-5 sm:p-6">
            <Bar
              data={ageSexData}
              options={commonOptions}
            />
          </div>
        </section>

        {/* DIAGNOSIS */}

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <h3 className="text-base font-extrabold text-slate-900">
              Diagnosis Distribution
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Most frequently recorded diagnoses.
            </p>
          </div>

          <div className="h-[340px] p-5 sm:p-6">
            {diagnosisData.labels.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                No diagnosis data available.
              </div>
            ) : (
              <Doughnut
                data={diagnosisData}
                options={{
                  ...commonOptions,
                  scales: {},
                }}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

function AnalyticsStatCard({
  label,
  value,
  description,
  icon,
  iconClass,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-2 text-xs text-slate-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default PatientsDashboard;