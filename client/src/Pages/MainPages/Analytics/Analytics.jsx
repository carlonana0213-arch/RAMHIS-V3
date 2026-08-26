import { useEffect, useMemo, useState } from "react";
import axios from "axios";


import {
  API_BASE_URL,
  FASTAPI_BASE_URL,
} from "../../../Services/apiConfig";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  FiActivity,
  FiCalendar,
  FiMapPin,
  FiRefreshCw,
  FiUsers,
  FiClock,
  FiAlertTriangle,
  FiTrendingUp,
  FiPackage,
  FiCheckCircle,
  FiInfo,
  FiArrowRight,
  FiBarChart2,
  FiTarget,
  FiDatabase,
  FiAlertCircle,
} from "react-icons/fi";






const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [nextMissionDate, setNextMissionDate] = useState("");
  const [missionDays, setMissionDays] = useState(1);

const [historicalPatients, setHistoricalPatients] = useState([]);  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/patients/locations`,
      );

      setLocations(res.data || []);
    } catch (error) {
      console.error("Failed to load locations:", error);
    }
  };

  const generateAnalytics = async () => {
    try {
      if (!selectedLocation) {
        alert("Please select a location");
        return;
      }

      if (!nextMissionDate) {
        alert("Please select a mission date");
        return;
      }

      setLoading(true);

      const res = await axios.post(
        `${FASTAPI_BASE_URL}/generate-forecast`,
        {
          location: selectedLocation,
          nextMissionDate,
          missionDays: Number(missionDays),
        },
      );

      setAnalytics(res.data);

await fetchHistoricalPatients();

      
    } catch (error) {
      console.error("Forecast error:", error);
      alert("Failed to generate analytics");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoricalPatients = async () => {
  try {
    if (!selectedLocation) {
      setHistoricalPatients([]);
      return;
    }

    const res = await axios.get(
      `${API_BASE_URL}/api/patients/analytics`,
      {
        params: {
          location: selectedLocation,
          page: 1,
          limit: 10000,
        },
      },
    );

    setHistoricalPatients(res.data?.patients || []);
  } catch (error) {
    console.error(
      "Failed to load historical patients:",
      error,
    );

    setHistoricalPatients([]);
  }
};

  const smartInsights = useMemo(() => {
    if (!Analytics) return [];

    const insights = [];

    const predictedPatients =
      Analytics?.predictedPatients || 0;

    const range =
      (Analytics?.confidenceRange?.max || 0) -
      (analytics?.confidenceRange?.min || 0);

    if (predictedPatients > 100) {
      insights.push({
        type: "warning",
        text: "High patient turnout expected for this mission.",
      });
    }

    if (range > 40) {
      insights.push({
        type: "info",
        text: "Forecast variability is high due to limited historical data.",
      });
    }

    if (
      (Analytics?.medicineForecast || []).some(
        (med) => med.risk === "HIGH",
      )
    ) {
      insights.push({
        type: "danger",
        text: "Potential medicine shortages detected.",
      });
    }

    if (Analytics?.confidence === "VERY LOW") {
      insights.push({
        type: "danger",
        text:
          "Historical mission data is limited and forecast reliability is low.",
      });
    }

    return insights;
  }, [Analytics]);

  const confidenceStyles = {
    HIGH:
      "border-emerald-200 bg-status-stable-bg text-status-stable-text",
    MEDIUM:
      "border-blue-200 bg-primary-50 text-primary-700",
    LOW:
      "border-amber-200 bg-status-watch-bg text-status-watch-text",
    "VERY LOW":
      "border-red-200 bg-status-critical-bg text-status-critical-text",
  };

  const riskStyles = {
    HIGH:
      "border-red-200 bg-status-critical-bg text-status-critical-text",
    MEDIUM:
      "border-amber-200 bg-status-watch-bg text-status-watch-text",
    LOW:
      "border-emerald-200 bg-status-stable-bg text-status-stable-text",
  };

  const formatDate = (date) => {
    if (!date) return "Not selected";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    );
  };

  const chartData = useMemo(() => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyCounts = Array(12).fill(0);

  historicalPatients.forEach((patient) => {
    if (!patient.visitDate) {
      return;
    }

    const date = new Date(patient.visitDate);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const monthIndex = date.getMonth();

    monthlyCounts[monthIndex] += 1;
  });

  return months.map((month, index) => ({
    month,
    patients: monthlyCounts[index],
  }));
}, [historicalPatients]);
  


  return (

    <div className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-50 text-primary-700">
                <FiActivity size={15} />
              </div>

              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary-700">
                Analytics & Forecasting
              </p>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
              Predictive Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
              Generate data-driven forecasts to support mission planning,
              patient demand preparation, and medicine inventory decisions.
            </p>
          </div>

          {analytics && (
            <div className="flex w-full items-center gap-3 rounded-2xl border border-emerald-100 bg-surface px-4 py-3.5 shadow-sm xl:w-auto">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-status-stable-bg text-status-stable-text">
                <FiCheckCircle size={18} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-subtle">
                  Forecast Status
                </p>

                <p className="mt-0.5 text-sm font-extrabold text-text-primary">
                  Forecast generated successfully
                </p>
              </div>
            </div>
          )}
        </div>

    


        {/* =====================================================
            FORECAST SETUP
        ====================================================== */}

        <section className="mb-7 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border-soft px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <FiTarget size={19} />
              </div>

              <div>
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-700">
                  Mission Forecast Setup
                </p>

                <h2 className="mt-0.5 text-base font-extrabold text-text-primary">
                  Configure your prediction
                </h2>

                <p className="mt-1 text-xs text-text-muted">
                  Select the mission details used as input for the forecast.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-xs font-medium text-text-muted sm:flex">
              <FiDatabase className="text-text-subtle" />
              Uses historical RAMHIS records
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">

            {/* LOCATION */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-text-secondary">
                <FiMapPin className="text-primary-600" />
                Mission Location
              </label>

              <select
                value={selectedLocation}
                onChange={(e) =>
                  setSelectedLocation(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm font-medium text-slate-700 outline-none transition hover:border-border-strong focus:border-primary-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Select location
                </option>

                {locations.map((location) => (
                  <option
                    key={location}
                    value={location}
                  >
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-text-secondary">
                <FiCalendar className="text-primary-600" />
                Mission Date
              </label>

              <input
                type="date"
                value={nextMissionDate}
                onChange={(e) =>
                  setNextMissionDate(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-border bg-surface px-3 text-sm font-medium text-slate-700 outline-none transition hover:border-border-strong focus:border-primary-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* DURATION */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-text-secondary">
                <FiClock className="text-primary-600" />
                Mission Duration
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={missionDays}
                  onChange={(e) =>
                    setMissionDays(e.target.value)
                  }
                  className="h-12 w-full rounded-xl border border-border bg-surface px-3 pr-14 text-sm font-medium text-slate-700 outline-none transition hover:border-border-strong focus:border-primary-500 focus:ring-4 focus:ring-blue-50"
                />

                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-text-subtle">
                  Day{Number(missionDays) === 1 ? "" : "s"}
                </span>
              </div>
            </div>

            {/* BUTTON */}

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={generateAnalytics}
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-primary-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Generating Forecast...
                  </>
                ) : (
                  <>
                    Generate Forecast
                    <FiArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Current selection summary */}

          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-border-soft bg-slate-50/70 px-5 py-3.5 text-xs sm:px-6">
            <span className="text-text-muted">
              Location:{" "}
              <strong className="text-text-primary">
                {selectedLocation || "Not selected"}
              </strong>
            </span>

            <span className="text-text-muted">
              Mission date:{" "}
              <strong className="text-text-primary">
                {formatDate(nextMissionDate)}
              </strong>
            </span>

            <span className="text-text-muted">
              Duration:{" "}
              <strong className="text-text-primary">
                {missionDays || 1} day
                {Number(missionDays) === 1 ? "" : "s"}
              </strong>
            </span>
          </div>
        </section>

        {/* =====================================================
            LOADING STATE
        ====================================================== */}

        {loading && (
          <section className="mb-7 rounded-2xl border border-border bg-surface p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <FiRefreshCw className="animate-spin" size={20} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-text-primary">
                  Generating predictive forecast
                </h2>

                <p className="mt-1 text-sm text-text-muted">
                  Analyzing historical records and preparing mission
                  predictions...
                </p>
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!analytics && !loading && (
          <section className="overflow-hidden rounded-2xl border border-dashed border-border-strong bg-surface shadow-sm">
            <div className="px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <FiTrendingUp size={28} />
              </div>

              <h2 className="mt-6 text-lg font-extrabold text-text-primary">
                Ready to generate a forecast
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-muted">
                Select a mission location, date, and duration to analyze
                historical records and prepare a predictive forecast.
              </p>

              <div className="mx-auto mt-7 flex max-w-xl flex-wrap justify-center gap-2">
                {[
                  "Patient demand",
                  "Department workload",
                  "Medicine needs",
                  "Mission insights",
                ].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-text-secondary"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            RESULTS
        ====================================================== */}

        {analytics && !loading && (
          <div className="space-y-7">

            {/* SUMMARY CARDS */}

            <section>
              <div className="mb-4">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-700">
                  Forecast Overview
                </p>

                <h2 className="mt-1 text-lg font-extrabold text-text-primary">
                  Mission prediction summary
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* PRIMARY CARD */}

                <div className="relative overflow-hidden rounded-2xl bg-primary-800 p-5 shadow-sm">
                  <div className="absolute right-[-18px] top-[-18px] h-28 w-28 rounded-full bg-white/5" />
                  <div className="absolute bottom-[-42px] right-8 h-24 w-24 rounded-full bg-white/5" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <p className="text-xs font-bold text-blue-100">
                        Forecasted Patients
                      </p>

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white">
                        <FiUsers />
                      </div>
                    </div>

                    <p className="mt-5 text-4xl font-extrabold tracking-tight text-white">
                      {analytics?.predictedPatients || 0}
                    </p>

                    <p className="mt-3 text-xs leading-5 text-blue-100">
                      Expected patient turnout for the planned mission.
                    </p>

                    <div className="mt-4 inline-flex rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white">
                      Range:{" "}
                      {analytics?.confidenceRange?.min || 0}
                      {" – "}
                      {analytics?.confidenceRange?.max || 0}
                    </div>
                  </div>
                </div>

                <MetricCard
                  label="Forecast Method"
                  value={
                    analytics?.forecastMethod === "prophet"
                      ? "Prophet"
                      : "Weighted Statistical"
                  }
                  description="Prediction model used"
                  icon={<FiActivity />}
                  iconClass="bg-indigo-50 text-indigo-700"
                >
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-extrabold ${
                      confidenceStyles[
                        analytics?.confidence
                      ] ||
                      "border-slate-200 bg-slate-100 text-text-secondary"
                    }`}
                  >
                    {analytics?.confidence || "UNKNOWN"} CONFIDENCE
                  </span>
                </MetricCard>

                <MetricCard
                  label="Historical Missions"
                  value={
                    analytics?.historicalMissionCount || 0
                  }
                  description="Records used for prediction"
                  icon={<FiCalendar />}
                  iconClass="bg-slate-100 text-slate-700"
                />

                <MetricCard
                  label="Mission Duration"
                  value={missionDays}
                  description={`Day${
                    Number(missionDays) === 1 ? "" : "s"
                  } planned`}
                  icon={<FiClock />}
                  iconClass="bg-status-stable-bg text-status-stable-text"
                />
              </div>
            </section>

            {/* =====================================================
                FORECAST TREND
            ====================================================== */}

            {analytics?.forecastMethod === "prophet" &&
              analytics?.forecastTrend?.length > 0 && (
                <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
                  <div className="flex flex-col gap-4 border-b border-border-soft px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <FiBarChart2 className="text-primary-600" />

                        <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-700">
                          Patient Demand
                        </p>
                      </div>

                      <h2 className="mt-2 text-base font-extrabold text-text-primary">
                        Forecast Trend
                      </h2>

                      <p className="mt-1 text-xs text-text-muted">
                        Projected patient demand based on historical
                        mission patterns.
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-slate-50 px-3 py-2 text-xs text-text-muted">
                      Forecasted patient volume over time
                    </div>
                  </div>

                  <div className="h-[320px] w-full p-4 sm:h-[390px] sm:p-6">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={analytics.forecastTrend}
                        margin={{
                          top: 10,
                          right: 10,
                          left: -20,
                          bottom: 5,
                        }}
                      >
                        <defs>
                          <linearGradient
                            id="forecastFill"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#2563eb"
                              stopOpacity={0.24}
                            />

                            <stop
                              offset="100%"
                              stopColor="#2563eb"
                              stopOpacity={0.01}
                            />
                          </linearGradient>
                        </defs>

                        <CartesianGrid
                          stroke="#e2e8f0"
                          strokeDasharray="3 3"
                          vertical={false}
                        />

                        <XAxis
                          dataKey="ds"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#64748b",
                            fontSize: 11,
                          }}
                          tickFormatter={(value) =>
                            new Date(
                              value,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              },
                            )
                          }
                        />

                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#64748b",
                            fontSize: 11,
                          }}
                        />

                        <Tooltip
                          contentStyle={{
                            border:
                              "1px solid #e2e8f0",
                            borderRadius: "14px",
                            boxShadow:
                              "0 12px 30px rgba(15, 23, 42, 0.12)",
                            fontSize: "12px",
                          }}
                          labelFormatter={(value) =>
                            new Date(
                              value,
                            ).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          }
                        />

                        <Area
                          type="monotone"
                          dataKey="yhat"
                          name="Predicted Patients"
                          stroke="#2563eb"
                          strokeWidth={3}
                          fill="url(#forecastFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

            {/* =====================================================
                OPERATIONAL FORECASTS
            ====================================================== */}

          <section>
  <div className="mb-4">
    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-700">
      Operational Planning
    </p>

    <h2 className="mt-1 text-lg font-extrabold text-text-primary">
      Department & patient insights
    </h2>
  </div>

  <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
    <div className="border-b border-border-soft px-5 py-5 sm:px-6">
      <h3 className="text-base font-extrabold text-text-primary">
        Patient Trend Forecast
      </h3>

      <p className="mt-1 text-xs text-text-muted">
        Projected monthly patient visits from January to December.
      </p>
    </div>

    <div className="h-[380px] p-5 sm:p-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="patients"
            name="Predicted Patients"
            stroke="#1f2937"
            strokeWidth={3}
            dot={{
              r: 5,
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </section>
</section>

            

            {/* =====================================================
                MEDICINE FORECAST
            ====================================================== */}

            <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
              <div className="flex flex-col gap-4 border-b border-border-soft px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                    <FiPackage size={19} />
                  </div>

                  <div>
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-primary-700">
                      Inventory Planning
                    </p>

                    <h2 className="mt-1 text-base font-extrabold text-text-primary">
                      Medicine Forecast
                    </h2>

                    <p className="mt-1 text-xs text-text-muted">
                      Estimated medicine demand and associated inventory risk.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-medium text-text-muted">
                  <FiAlertTriangle className="text-status-watch-text" />
                  Review high-risk medicines before the mission
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border bg-slate-50/80">
                      <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                        Medicine
                      </th>

                      <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                        Estimated Need
                      </th>

                      <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                        Inventory Risk
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border-soft">
                    {(analytics?.medicineForecast || [])
                      .length === 0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-5 py-12 text-center text-sm text-text-muted"
                        >
                          No medicine forecast available.
                        </td>
                      </tr>
                    ) : (
                      analytics.medicineForecast.map(
                        (item, index) => (
                          <tr
                            key={`${item.medicine}-${index}`}
                            className="transition-colors hover:bg-primary-50/30"
                          >
                            <td className="px-5 py-4 text-sm font-bold text-text-primary">
                              {item.medicine}
                            </td>

                            <td className="px-5 py-4 text-sm font-semibold text-text-secondary">
                              {item.estimatedNeed}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-extrabold ${
                                  riskStyles[
                                    item.risk
                                  ] ||
                                  "border-slate-200 bg-slate-100 text-text-secondary"
                                }`}
                              >
                                {item.risk || "UNKNOWN"}
                              </span>
                            </td>
                          </tr>
                        ),
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* =====================================================
                INSIGHTS
            ====================================================== */}

            <section className="grid gap-6 xl:grid-cols-2">
              <InsightCard
                title="Summary Insights"
                subtitle="Key observations from the generated forecast."
                items={analytics?.summaryInsights || []}
                icon={<FiCheckCircle />}
                emptyText="No summary insights available."
                iconClass="bg-status-stable-bg text-status-stable-text"
              />

              <SmartInsightsCard
                insights={smartInsights}
              />
            </section>

            {/* =====================================================
                DISCLAIMER
            ====================================================== */}

            <div className="flex gap-3 rounded-2xl border border-blue-100 bg-primary-50/70 p-4 sm:p-5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-primary-700 shadow-sm">
                <FiInfo />
              </div>

              <div>
                <p className="text-sm font-bold text-blue-900">
                  Analytics Support Notice
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-800">
                  Predictive analytics are based on historical records
                  and are intended to support mission planning,
                  reporting, and administrative decisions. Forecast
                  results should not be treated as medical diagnosis or
                  clinical treatment recommendations.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ============================================================
   METRIC CARD
============================================================ */

function MetricCard({
  label,
  value,
  description,
  icon,
  iconClass,
  children,
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold text-text-muted">
            {label}
          </p>

          <div className="mt-2">
            <p className="truncate text-2xl font-extrabold tracking-tight text-text-primary">
              {value}
            </p>
          </div>

          {children ? (
            <div className="mt-3">{children}</div>
          ) : (
            <p className="mt-3 text-xs text-text-muted">
              {description}
            </p>
          )}
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TABLE CARD
============================================================ */

function AnalyticsTableCard({
  title,
  subtitle,
  headers,
  rows,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border-soft px-5 py-5 sm:px-6">
        <h2 className="text-base font-extrabold text-text-primary">
          {title}
        </h2>

        <p className="mt-1 text-xs text-text-muted">
          {subtitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-slate-50/80">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-soft">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-5 py-12 text-center text-sm text-text-muted"
                >
                  No data available.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={`${row[0]}-${rowIndex}`}
                  className="transition-colors hover:bg-primary-50/30"
                >
                  {row.map((value, columnIndex) => (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                      className={`px-5 py-4 text-sm ${
                        columnIndex === 0
                          ? "font-bold text-text-primary"
                          : "font-semibold text-text-secondary"
                      }`}
                    >
                      {value ?? "—"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ============================================================
   SUMMARY INSIGHT CARD
============================================================ */

function InsightCard({
  title,
  subtitle,
  items,
  icon,
  emptyText,
  iconClass,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border-soft px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>

          <div>
            <h2 className="text-base font-extrabold text-text-primary">
              {title}
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {items.length === 0 ? (
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-text-muted">
              {emptyText}
            </p>
          </div>
        ) : (
          items.map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex gap-3 rounded-xl border border-border-soft bg-slate-50/80 p-4"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[10px] font-extrabold text-primary-700">
                {index + 1}
              </span>

              <p className="text-sm font-medium leading-6 text-text-secondary">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ============================================================
   SMART INSIGHTS
============================================================ */

function SmartInsightsCard({
  insights,
}) {
  const insightStyles = {
    warning:
      "border-amber-100 bg-status-watch-bg text-status-watch-text",
    danger:
      "border-red-100 bg-status-critical-bg text-status-critical-text",
    info:
      "border-blue-100 bg-primary-50 text-primary-700",
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      <div className="border-b border-border-soft px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-status-watch-bg text-status-watch-text">
            <FiAlertTriangle />
          </div>

          <div>
            <h2 className="text-base font-extrabold text-text-primary">
              Smart Insights
            </h2>

            <p className="mt-1 text-xs text-text-muted">
              Automatically detected forecast observations.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {insights.length === 0 ? (
          <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
            <FiInfo className="mt-0.5 shrink-0 text-text-subtle" />

            <p className="text-sm text-text-muted">
              No additional planning risks were detected for this forecast.
            </p>
          </div>
        ) : (
          insights.map((insight, index) => (
            <div
              key={`${insight.type}-${index}`}
              className={`flex gap-3 rounded-xl border p-4 ${
                insightStyles[insight.type]
              }`}
            >
              <FiAlertCircle className="mt-0.5 shrink-0" />

              <p className="text-sm font-medium leading-6">
                {insight.text}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Analytics;