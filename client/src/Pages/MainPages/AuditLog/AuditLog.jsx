import { useEffect, useState } from "react";
import {
  FaSearch,
  FaClipboardList,
  FaFilter,
  FaUserShield,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import {
  getAuditLogs,
  getAuditLocations,
} from "../../../Services/auditLogService";

function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [locations, setLocations] = useState([]);

  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const [loading, setLoading] = useState(true);

  const moduleFilters = [
    "All",
    "Authentication",
    "Registration",
    "Consultation",
    "Medicine Release",
    "Inventory",
    "Accounts",
    "Events",
  ];

  const loadLogs = async () => {
    try {
      setLoading(true);

      const result = await getAuditLogs({
        search,
        module: moduleFilter,
        location: locationFilter,
      });

      setLogs(Array.isArray(result?.data) ? result.data : []);
    } catch (error) {
      console.error("Failed to load audit logs:", error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const result = await getAuditLocations();

      setLocations(
        Array.isArray(result?.data)
          ? result.data
          : [],
      );
    } catch (error) {
      console.error(
        "Failed to load audit locations:",
        error,
      );

      setLocations([]);
    }
  };

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadLogs();
    }, 300);

    return () => clearTimeout(timer);
  }, [
    search,
    moduleFilter,
    locationFilter,
  ]);

  const formatDate = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      },
    );
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return "-";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "-";
    }

    return date.toLocaleTimeString(
      undefined,
      {
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const getModuleStyle = (module) => {
    switch (module) {
      case "Authentication":
        return "bg-primary-50 text-primary-700 border-blue-100";

      case "Registration":
        return "bg-violet-50 text-violet-700 border-violet-100";

      case "Consultation":
        return "bg-status-stable-bg text-status-stable-text border-emerald-100";

      case "Medicine Release":
        return "bg-cyan-50 text-cyan-700 border-cyan-100";

      case "Inventory":
        return "bg-status-watch-bg text-status-watch-text border-amber-100";

      case "Accounts":
        return "bg-indigo-50 text-indigo-700 border-indigo-100";

      case "Events":
        return "bg-orange-50 text-orange-700 border-orange-100";

      default:
        return "bg-slate-50 text-slate-700 border-border";
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-5 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-[1700px]">

{/* =====================================================
    PAGE HEADER
====================================================== */}

<div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
  <div className="flex items-start gap-3">
    <div className="mt-4.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
      <FaClipboardList size={21} />
    </div>

    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
        System Administration
      </p>

      <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
        Audit Log
      </h1>

      <p className="mt-1 text-sm text-text-muted">
        Monitor system activities and administrative actions.
      </p>
    </div>
  </div>

  <div className="shrink-0 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700">
    <div className="flex items-center gap-2">
      <FaUserShield size={14} />
      <span>Administrator Audit Trail</span>
    </div>
  </div>
</div>
        {/* =====================================================
            SEARCH & FILTERS
        ====================================================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <FaFilter size={15} />
              </div>

              <div>
                <h2 className="text-sm font-extrabold text-text-primary">
                  Search & Filters
                </h2>

                <p className="text-xs text-text-muted">
                  Search and refine recorded system activities.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            {/* SEARCH */}

            <div className="relative">
              <FaSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
                size={15}
              />

              <input
                type="text"
                placeholder="Search by user, action, location, or details..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full rounded-xl border border-border bg-slate-50 py-3 pl-11 pr-4 text-sm text-text-primary outline-none transition placeholder:text-text-subtle focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-100"
              />
            </div>

            {/* MODULE */}

            <div>
              <select
                value={moduleFilter}
                onChange={(e) =>
                  setModuleFilter(e.target.value)
                }
                className="w-full appearance-none rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-text-primary outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-100"
              >
                {moduleFilters.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item === "All"
                      ? "All Modules"
                      : item}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}

            <div>
              <select
                value={locationFilter}
                onChange={(e) =>
                  setLocationFilter(
                    e.target.value,
                  )
                }
                className="w-full appearance-none rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-text-primary outline-none transition focus:border-primary-400 focus:bg-surface focus:ring-4 focus:ring-primary-100"
              >
                <option value="All">
                  All Locations
                </option>

                {locations.map(
                  (location) => (
                    <option
                      key={location}
                      value={location}
                    >
                      {location}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </section>

        {/* =====================================================
            AUDIT ACTIVITY TABLE
        ====================================================== */}

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
          {/* TABLE HEADER */}

          <div className="flex flex-col gap-4 border-b border-border px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <FaClipboardList size={17} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-text-primary">
                  System Activity
                </h2>

                <p className="mt-0.5 text-sm text-text-muted">
                  View recorded actions across the RAMHIS system.
                </p>
              </div>
            </div>

            <div className="inline-flex w-fit items-center rounded-lg border border-border bg-slate-50 px-3 py-2">
              <span className="text-xs font-bold text-text-muted">
                {loading
                  ? "Loading activity..."
                  : `${logs.length} record${
                      logs.length === 1
                        ? ""
                        : "s"
                    } found`}
              </span>
            </div>
          </div>

          {/* TABLE */}

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-border">
                  <th className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle">
                    User
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle">
                    Activity
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle">
                    Module
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle">
                    Date
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle">
                    Time
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 text-xs font-extrabold uppercase tracking-[0.12em] text-text-subtle">
                    Location
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border-soft">
                {/* LOADING */}

                {loading &&
                  Array.from({
                    length: 7,
                  }).map((_, index) => (
                    <tr key={index}>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />

                          <div className="space-y-2">
                            <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                            <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="space-y-2">
                          <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
                          <div className="h-2.5 w-52 animate-pulse rounded bg-slate-100" />
                        </div>
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                      </td>

                      <td className="px-5 py-5">
                        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                      </td>
                    </tr>
                  ))}

                {/* EMPTY */}

                {!loading &&
                  logs.length === 0 && (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-20 text-center"
                      >
                        <div className="mx-auto flex max-w-sm flex-col items-center">
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                            <FaClipboardList
                              size={26}
                            />
                          </div>

                          <h3 className="mt-5 text-lg font-bold text-text-primary">
                            No audit logs found
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-text-muted">
                            There are no recorded
                            activities matching your
                            current search or filter
                            settings.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}

                {/* LOG DATA */}

                {!loading &&
                  logs.length > 0 &&
                  logs.map((log) => {
                    const userName =
                      log.userName || "System";

                    const userInitial =
                      userName
                        .charAt(0)
                        .toUpperCase();

                    return (
                      <tr
                        key={log._id}
                        className="group transition-colors hover:bg-slate-50/70"
                      >
                        {/* USER */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-sm font-extrabold text-primary-700 transition group-hover:bg-primary-100">
                              {userInitial}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-bold text-text-primary">
                                {userName}
                              </p>

                              <p className="mt-0.5 text-xs text-text-muted">
                                {log.userRole || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* ACTIVITY */}

                        <td className="max-w-[340px] px-5 py-4">
                          <p className="text-sm font-bold text-text-primary">
                            {log.action || "-"}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-muted">
                            {log.description || "-"}
                          </p>
                        </td>

                        {/* MODULE */}

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold ${getModuleStyle(
                              log.module,
                            )}`}
                          >
                            {log.module || "System"}
                          </span>
                        </td>

                        {/* DATE */}

                        <td className="whitespace-nowrap px-5 py-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                            <FaCalendarAlt
                              className="text-text-subtle"
                              size={12}
                            />

                            {formatDate(
                              log.createdAt,
                            )}
                          </div>
                        </td>

                        {/* TIME */}

                        <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-text-secondary">
                          {formatTime(
                            log.createdAt,
                          )}
                        </td>

                        {/* LOCATION */}

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-text-secondary">
                            <FaMapMarkerAlt
                              className="text-text-subtle"
                              size={12}
                            />

                            {log.location || "System"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AuditLog;