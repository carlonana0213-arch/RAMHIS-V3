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
          : []
      );
    } catch (error) {
      console.error(
        "Failed to load audit locations:",
        error
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
      }
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
      }
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
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div className="mb-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <div className="mb-2 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-700">
                <FaClipboardList size={20} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-text-primary sm:text-3xl">
                  Audit Log
                </h1>

                <p className="mt-1 text-sm text-text-muted">
                  Monitor system activities and administrative actions.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>


      {/* =====================================================
          SEARCH & FILTER CARD
      ====================================================== */}

      <div className="mb-6 rounded-2xl border border-border bg-surface p-4 shadow-sm sm:p-5">

        <div className="mb-4 flex items-center gap-2">

          <FaFilter
            className="text-text-subtle"
            size={14}
          />

          <h2 className="text-sm font-bold text-slate-700">
            Search & Filters
          </h2>

        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px]">

          {/* SEARCH */}

          <div className="relative">

            <FaSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle"
              size={14}
            />

            <input
              type="text"
              placeholder="Search by user, action, location, or details..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-border bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-primary-500 focus:bg-surface focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* MODULE */}

          <div className="relative">

            <select
              value={moduleFilter}
              onChange={(e) =>
                setModuleFilter(e.target.value)
              }
              className="w-full appearance-none rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:bg-surface focus:ring-2 focus:ring-blue-100"
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

          <div className="relative">

            <select
              value={locationFilter}
              onChange={(e) =>
                setLocationFilter(
                  e.target.value
                )
              }
              className="w-full appearance-none rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none transition focus:border-primary-500 focus:bg-surface focus:ring-2 focus:ring-blue-100"
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
                )
              )}
            </select>

          </div>

        </div>
      </div>


      {/* =====================================================
          AUDIT LOG TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">

        {/* TABLE HEADER */}

        <div className="flex flex-col gap-2 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h2 className="text-base font-bold text-text-primary">
              System Activity
            </h2>

            <p className="mt-1 text-xs text-text-subtle">
              {loading
                ? "Loading activity..."
                : `${logs.length} record${
                    logs.length === 1
                      ? ""
                      : "s"
                  } found`}
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-text-subtle">

            <FaUserShield size={13} />

            <span>
              Administrator Audit Trail
            </span>

          </div>

        </div>


        {/* RESPONSIVE TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead>
              <tr className="border-b border-border bg-slate-50">

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                  User
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                  Action
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                  Module
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                  Time
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-text-muted">
                  Location
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-border-soft">

              {/* =================================================
                  LOADING
              ================================================== */}

              {loading && (
                Array.from({
                  length: 7,
                }).map((_, index) => (
                  <tr key={index}>

                    <td className="px-5 py-5">
                      <div className="space-y-2">
                        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
                        <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="space-y-2">
                        <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="h-2.5 w-40 animate-pulse rounded bg-slate-100" />
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
                    </td>

                    <td className="px-5 py-5">
                      <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                    </td>

                    <td className="px-5 py-5">
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
                    </td>

                    <td className="px-5 py-5">
                      <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                    </td>

                  </tr>
                ))
              )}


              {/* =================================================
                  EMPTY
              ================================================== */}

              {!loading &&
                logs.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-16 text-center"
                    >

                      <div className="mx-auto flex max-w-sm flex-col items-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-text-subtle">
                          <FaClipboardList
                            size={22}
                          />
                        </div>

                        <h3 className="text-sm font-bold text-slate-700">
                          No audit logs found
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-text-subtle">
                          Try changing your search
                          or filter settings.
                        </p>

                      </div>

                    </td>
                  </tr>
                )}


              {/* =================================================
                  LOG DATA
              ================================================== */}

              {!loading &&
                logs.length > 0 &&
                logs.map((log) => {

                  const date =
                    new Date(
                      log.createdAt
                    );

                  return (
                    <tr
                      key={log._id}
                      className="transition hover:bg-slate-50/80"
                    >

                      {/* USER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                            <FaUserShield
                              size={14}
                            />
                          </div>

                          <div>

                            <p className="text-sm font-bold text-text-primary">
                              {log.userName ||
                                "System"}
                            </p>

                            <p className="mt-0.5 text-xs text-text-subtle">
                              {log.userRole ||
                                "-"}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* ACTION */}

                      <td className="max-w-[320px] px-5 py-4">

                        <p className="text-sm font-semibold text-text-primary">
                          {log.action ||
                            "-"}
                        </p>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-text-subtle">
                          {log.description ||
                            "-"}
                        </p>

                      </td>


                      {/* MODULE */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${getModuleStyle(
                            log.module
                          )}`}
                        >
                          {log.module ||
                            "System"}
                        </span>

                      </td>


                      {/* DATE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">

                          <FaCalendarAlt
                            className="text-text-subtle"
                            size={12}
                          />

                          {formatDate(
                            log.createdAt
                          )}

                        </div>

                      </td>


                      {/* TIME */}

                      <td className="px-5 py-4 text-sm font-medium text-text-secondary">
                        {formatTime(
                          log.createdAt
                        )}
                      </td>


                      {/* LOCATION */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm font-medium text-text-secondary">

                          <FaMapMarkerAlt
                            className="text-text-subtle"
                            size={12}
                          />

                          {log.location ||
                            "System"}

                        </div>

                      </td>

                    </tr>
                  );
                })}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default AuditLog;