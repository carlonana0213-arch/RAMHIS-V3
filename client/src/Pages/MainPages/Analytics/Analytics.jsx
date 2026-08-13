import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { API_BASE_URL, FASTAPI_BASE_URL } from "../../../Services/apiConfig";

import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
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
} from "react-icons/fi";

const Analytics = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [nextMissionDate, setNextMissionDate] = useState("");
  const [missionDays, setMissionDays] = useState(1);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

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
    } catch (error) {
      console.error("Forecast error:", error);
      alert("Failed to generate analytics");
    } finally {
      setLoading(false);
    }
  };

  const smartInsights = useMemo(() => {
    if (!analytics) return [];

    const insights = [];

    const predictedPatients =
      analytics?.predictedPatients || 0;

    const range =
      (analytics?.confidenceRange?.max || 0) -
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
      (analytics?.medicineForecast || []).some(
        (med) => med.risk === "HIGH",
      )
    ) {
      insights.push({
        type: "danger",
        text: "Potential medicine shortages detected.",
      });
    }

    if (analytics?.confidence === "VERY LOW") {
      insights.push({
        type: "danger",
        text: "Historical mission data is limited and forecast reliability is low.",
      });
    }

    return insights;
  }, [analytics]);

  const confidenceStyles = {
    HIGH: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    MEDIUM: "bg-blue-50 text-blue-700 ring-blue-200",
    LOW: "bg-amber-50 text-amber-700 ring-amber-200",
    "VERY LOW":
      "bg-red-50 text-red-700 ring-red-200",
  };

  const riskStyles = {
    HIGH: "bg-red-50 text-red-700 ring-red-200",
    MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
    LOW: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-extrabold tracking-[0.12em] text-blue-700">
                RAMHIS ANALYTICS
              </span>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Predictive Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Forecast upcoming mission needs using historical
              patient and mission records.
            </p>
          </div>

          {analytics && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
              <FiActivity className="text-blue-600" />

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Forecast Status
                </p>

                <p className="text-sm font-bold text-slate-700">
                  Generated successfully
                </p>
              </div>
            </div>
          )}
        </div>

        {/* =====================================================
            FORECAST CONFIGURATION
        ====================================================== */}

        <section className="mb-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FiTrendingUp size={18} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Forecast Configuration
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  Select the mission details used to generate the forecast.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">

            {/* LOCATION */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                <FiMapPin className="text-blue-600" />
                Mission Location
              </label>

              <select
                value={selectedLocation}
                onChange={(e) =>
                  setSelectedLocation(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              >
                <option value="">
                  Select Location
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
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                <FiCalendar className="text-blue-600" />
                Mission Date
              </label>

              <input
                type="date"
                value={nextMissionDate}
                onChange={(e) =>
                  setNextMissionDate(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* DAYS */}

            <div>
              <label className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-600">
                <FiClock className="text-blue-600" />
                Mission Duration
              </label>

              <input
                type="number"
                min="1"
                value={missionDays}
                onChange={(e) =>
                  setMissionDays(e.target.value)
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            {/* BUTTON */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={generateAnalytics}
                disabled={loading}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <FiRefreshCw className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FiActivity />
                    Generate Forecast
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            EMPTY STATE
        ====================================================== */}

        {!analytics && !loading && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiTrendingUp size={25} />
            </div>

            <h2 className="mt-5 text-base font-extrabold text-slate-800">
              Ready to generate a forecast
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Select a mission location, date, and duration above
              to view predictive analytics.
            </p>
          </div>
        )}

        {/* =====================================================
            RESULTS
        ====================================================== */}

        {analytics && (
          <div className="space-y-7">

            {/* SUMMARY CARDS */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Forecasted Patients
                    </p>

                    <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
                      {analytics?.predictedPatients || 0}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      95% range:{" "}
                      <span className="font-bold text-slate-700">
                        {analytics?.confidenceRange?.min || 0}
                        {" – "}
                        {analytics?.confidenceRange?.max || 0}
                      </span>
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FiUsers />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Forecast Method
                    </p>

                    <p className="mt-2 text-xl font-extrabold text-slate-900">
                      {analytics?.forecastMethod === "prophet"
                        ? "Prophet"
                        : "Weighted Statistical"}
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold ring-1 ring-inset ${
                        confidenceStyles[
                          analytics?.confidence
                        ] ||
                        "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {analytics?.confidence || "UNKNOWN"} CONFIDENCE
                    </span>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                    <FiActivity />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Historical Missions
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-slate-900">
                      {analytics?.historicalMissionCount || 0}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Records used for prediction
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <FiCalendar />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500">
                      Mission Duration
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-slate-900">
                      {missionDays}
                    </p>

                    <p className="mt-2 text-xs text-slate-500">
                      Day{Number(missionDays) === 1 ? "" : "s"} planned
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <FiClock />
                  </div>
                </div>
              </div>
            </div>

            {/* FORECAST TREND */}

            {analytics?.forecastMethod === "prophet" &&
              analytics?.forecastTrend?.length > 0 && (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                    <h2 className="text-base font-extrabold text-slate-900">
                      Forecast Trend
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Projected patient demand based on historical trends.
                    </p>
                  </div>

                  <div className="h-[350px] w-full p-4 sm:p-6">
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
                              stopOpacity={0.22}
                            />

                            <stop
                              offset="100%"
                              stopColor="#2563eb"
                              stopOpacity={0.02}
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
                            new Date(value).toLocaleDateString(
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
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow:
                              "0 10px 30px rgba(15, 23, 42, 0.08)",
                            fontSize: "12px",
                          }}
                          labelFormatter={(value) =>
                            new Date(value).toLocaleDateString(
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
                          stroke="#2563eb"
                          strokeWidth={3}
                          fill="url(#forecastFill)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </section>
              )}

            {/* TWO TABLES */}

            <div className="grid gap-6 xl:grid-cols-2">

              {/* DEPARTMENT */}

              <AnalyticsTableCard
                title="Department Forecast"
                subtitle="Predicted patient demand by department."
                headers={["Department", "Predicted Patients"]}
                rows={(analytics?.departmentForecast || []).map(
                  (item) => [
                    item.department,
                    item.predictedPatients,
                  ],
                )}
              />

              {/* DIAGNOSES */}

              <AnalyticsTableCard
                title="Top Diagnoses"
                subtitle="Most frequently recorded conditions in the forecast data."
                headers={["Diagnosis", "Count"]}
                rows={(analytics?.topDiagnoses || []).map(
                  (item) => [
                    item.diagnosis,
                    item.count,
                  ],
                )}
              />
            </div>

            {/* MEDICINE */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FiPackage />
                  </div>

                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">
                      Medicine Forecast
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Estimated medicine demand and associated inventory risk.
                    </p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                      <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Medicine
                      </th>

                      <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Estimated Need
                      </th>

                      <th className="px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                        Risk
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {(analytics?.medicineForecast || []).length ===
                    0 ? (
                      <tr>
                        <td
                          colSpan={3}
                          className="px-5 py-12 text-center text-sm text-slate-500"
                        >
                          No medicine forecast available.
                        </td>
                      </tr>
                    ) : (
                      analytics.medicineForecast.map(
                        (item, index) => (
                          <tr
                            key={index}
                            className="transition-colors hover:bg-blue-50/30"
                          >
                            <td className="px-5 py-4 text-sm font-bold text-slate-800">
                              {item.medicine}
                            </td>

                            <td className="px-4 py-4 text-sm font-semibold text-slate-600">
                              {item.estimatedNeed}
                            </td>

                            <td className="px-4 py-4">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                                  riskStyles[item.risk] ||
                                  "bg-slate-100 text-slate-600 ring-slate-200"
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

            {/* INSIGHTS */}

            <div className="grid gap-6 lg:grid-cols-2">

              <InsightCard
                title="Summary Insights"
                items={analytics?.summaryInsights || []}
                icon={<FiCheckCircle />}
                emptyText="No summary insights available."
              />

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                      <FiAlertTriangle />
                    </div>

                    <div>
                      <h2 className="text-base font-extrabold text-slate-900">
                        Smart Insights
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Automatically detected forecast observations.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5 sm:p-6">
                  {smartInsights.length === 0 ? (
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4">
                      <FiInfo className="shrink-0 text-slate-400" />

                      <p className="text-sm text-slate-500">
                        No additional insights available.
                      </p>
                    </div>
                  ) : (
                    smartInsights.map((insight, index) => {
                      const styles = {
                        warning:
                          "bg-amber-50 text-amber-700 border-amber-100",
                        danger:
                          "bg-red-50 text-red-700 border-red-100",
                        info:
                          "bg-blue-50 text-blue-700 border-blue-100",
                      };

                      return (
                        <div
                          key={index}
                          className={`rounded-xl border p-4 text-sm font-medium leading-6 ${
                            styles[insight.type]
                          }`}
                        >
                          {insight.text}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* DISCLAIMER */}

            <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <FiInfo className="mt-0.5 shrink-0 text-blue-600" />

              <p className="text-xs leading-5 text-blue-800">
                Predictive analytics are based on historical records
                and are intended to support mission planning,
                reporting, and administrative decisions. Forecast
                results should not be treated as medical diagnosis
                or clinical treatment recommendations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

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
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <h2 className="text-base font-extrabold text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          {subtitle}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {headers.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  No data available.
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="transition-colors hover:bg-blue-50/30"
                >
                  {row.map((value, columnIndex) => (
                    <td
                      key={columnIndex}
                      className={`px-5 py-4 text-sm ${
                        columnIndex === 0
                          ? "font-bold text-slate-800"
                          : "font-semibold text-slate-600"
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
   INSIGHT CARD
============================================================ */

function InsightCard({
  title,
  items,
  icon,
  emptyText,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {icon}
          </div>

          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              {title}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Key observations from the generated forecast.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 sm:p-6">
        {items.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
            {emptyText}
          </p>
        ) : (
          items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-xl bg-slate-50 p-4"
            >
              <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-extrabold text-blue-700">
                {index + 1}
              </span>

              <p className="text-sm font-medium leading-6 text-slate-600">
                {item}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Analytics;