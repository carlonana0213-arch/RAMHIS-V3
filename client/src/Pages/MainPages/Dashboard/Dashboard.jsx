import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  FileDown,
  Loader2,
} from "lucide-react";

import {
  getDashboardSummary,
  getPatientTrends,
  getDiagnosisDistribution,
  getTopMedicines,
} from "../../../Services/dashboardService";

import DashboardCards from "./components/DashboardCards";
import DashboardPatientGraphs from "./components/DashboardPatientsGraphs";
import DashboardInventoryGraphs from "./components/DashboardInventoryGraphs";
import DashboardPieCard from "./components/DashboardPieCard";

import Modal from "../../../Components/ui/modal";

import { generateDashboardPDF } from "./DashboardPDFReport";

function Dashboard() {
  const [summary, setSummary] = useState({});
  const [patientTrends, setPatientTrends] = useState([]);
  const [diagnosisData, setDiagnosisData] = useState([]);
  const [topMedicines, setTopMedicines] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     PDF STATES
  ====================================================== */

  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showPdfPreview, setShowPdfPreview] =
    useState(false);

  /* =====================================================
     LOAD DASHBOARD
  ====================================================== */

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          summaryData,
          trendsData,
          diagnosisResult,
          medicinesResult,
        ] = await Promise.all([
          getDashboardSummary(),
          getPatientTrends(),
          getDiagnosisDistribution(),
          getTopMedicines(),
        ]);

        setSummary(summaryData || {});
        setPatientTrends(trendsData || []);
        setDiagnosisData(
          diagnosisResult || []
        );
        setTopMedicines(
          medicinesResult || []
        );
      } catch (err) {
        console.error(
          "Failed to load dashboard:",
          err
        );

        setError(
          "Unable to load dashboard data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  /* =====================================================
     GENERATE PDF
  ====================================================== */

  const handleExportPDF = async () => {
    try {
      setPdfLoading(true);

      /*
       * Generate the PDF using the data already
       * loaded on the dashboard.
       */
      const pdfBlob =
        generateDashboardPDF({
          summary,
          patientTrends,
          diagnosisData,
          topMedicines,
        });

      /*
       * Remove previous PDF URL if one exists.
       */
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }

      /*
       * Create a browser URL for the generated PDF.
       */
      const newPdfUrl =
        URL.createObjectURL(pdfBlob);

      setPdfUrl(newPdfUrl);

      /*
       * Open the preview modal.
       */
      setShowPdfPreview(true);
    } catch (err) {
      console.error(
        "Failed to generate dashboard PDF:",
        err
      );

      window.alert(
        "Unable to export the dashboard as PDF. Please try again."
      );
    } finally {
      setPdfLoading(false);
    }
  };

  /* =====================================================
     CLOSE PDF PREVIEW
  ====================================================== */

  const handleClosePdfPreview = () => {
    setShowPdfPreview(false);
  };

  /* =====================================================
     DOWNLOAD PDF
  ====================================================== */

  const handleSavePDF = () => {
    if (!pdfUrl) return;

    const link =
      document.createElement("a");

    link.href = pdfUrl;
    link.download = `RAMHIS-Dashboard-Report-${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  /* =====================================================
     CLEAN PDF URL
  ====================================================== */

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 text-text-muted">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary-100 border-t-primary-700" />

        <p className="text-sm font-medium">
          Loading dashboard...
        </p>
      </div>
    );
  }

  /* =====================================================
     CURRENT DATE
  ====================================================== */

  const currentDate =
    new Date().toLocaleDateString(
      "en-US",
      {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );

  /* =====================================================
     UI
  ====================================================== */

  return (
    <>
      <div className="min-h-full w-full px-4 py-5 pb-6 text-text-primary sm:px-5 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="mx-auto flex w-full max-w-[1900px] flex-col gap-5">

          {/* =================================================
              HEADER
          ================================================== */}

          <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-100 text-primary-700">
                <LayoutDashboard size={21} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-muted">
                  System Overview
                </p>

                <h1 className="mt-1 text-2xl font-bold tracking-tight text-primary-900">
                  Dashboard
                </h1>

                <p className="mt-1 text-sm text-text-muted">
                  Monitor your healthcare operations and system activity.
                </p>
              </div>

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================== */}

            <div className="flex shrink-0 items-center gap-3 sm:text-right">

              {/* EXPORT PDF */}

              <button
                type="button"
                onClick={handleExportPDF}
                disabled={pdfLoading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-primary-700
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-primary-800
                  focus:outline-none
                  focus:ring-4
                  focus:ring-primary-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {pdfLoading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />

                    Generating...
                  </>
                ) : (
                  <>
                    <FileDown size={16} />

                    Export PDF
                  </>
                )}
              </button>

              {/* DATE */}

              <div>
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                  Today
                </span>

                <strong className="mt-1 block text-sm font-semibold text-primary-900">
                  {currentDate}
                </strong>
              </div>

            </div>

          </header>

          {/* =================================================
              ERROR
          ================================================== */}

          {error && (
            <div className="rounded-xl border border-status-critical-border bg-status-critical-bg px-4 py-3 text-sm font-medium text-status-critical-text">
              {error}
            </div>
          )}

          {/* =================================================
              DASHBOARD CARDS
          ================================================== */}

          <DashboardCards
            summary={summary}
          />

          {/* =================================================
              MAIN CONTENT
          ================================================== */}

          <main className="grid min-w-0 grid-cols-1 gap-5 2xl:grid-cols-[1.45fr_1fr]">

            {/* LEFT */}

            <div className="grid min-w-0 gap-5">

              <div className="min-w-0">
                <DashboardPatientGraphs
                  patientTrends={
                    patientTrends
                  }
                />
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">

                <DashboardPieCard
                  title="Diagnosis Distribution"
                  subtitle="Top diagnoses"
                  data={diagnosisData}
                  labelKey="name"
                  valueKey="value"
                />

                <DashboardPieCard
                  title="Medicine Distribution"
                  subtitle="Most prescribed"
                  data={topMedicines}
                  labelKey="medicine"
                  valueKey="count"
                />

              </div>

            </div>

            {/* RIGHT */}

            <div className="min-w-0">
              <DashboardInventoryGraphs
                summary={summary}
                topMedicines={
                  topMedicines
                }
              />
            </div>

          </main>

        </div>
      </div>

      {/* =====================================================
          PDF PREVIEW MODAL
      ====================================================== */}

      <Modal
        open={showPdfPreview}
        onClose={handleClosePdfPreview}
        title="PDF Preview"
        size="full"
        closeOnOverlay={false}
        footer={
          <>
            <button
              type="button"
              onClick={
                handleClosePdfPreview
              }
              className="
                rounded-xl
                border
                border-slate-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-semibold
                text-slate-700
                transition
                hover:bg-slate-50
                focus:outline-none
                focus:ring-4
                focus:ring-slate-200
              "
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleSavePDF}
              disabled={!pdfUrl}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-primary-700
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition
                hover:bg-primary-800
                focus:outline-none
                focus:ring-4
                focus:ring-primary-500/20
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <FileDown size={16} />

              Save PDF
            </button>
          </>
        }
      >
        {pdfUrl ? (
          <div className="h-[70vh] min-h-[500px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
            <iframe
              src={pdfUrl}
              title="Dashboard PDF Preview"
              className="h-full w-full border-0"
            />
          </div>
        ) : (
          <div className="flex h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">

              <Loader2
                size={30}
                className="animate-spin"
              />

              <p className="text-sm font-medium">
                Preparing PDF preview...
              </p>

            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default Dashboard;