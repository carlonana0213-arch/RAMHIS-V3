import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/*
 * Dashboard PDF Report
 *
 * Frontend only.
 * Does not communicate with or modify the backend.
 *
 * The report is generated from the same data already
 * loaded by Dashboard.jsx.
 */

const COLORS = {
  navy: [30, 42, 94],
  blue: [39, 58, 120],
  lightBlue: [102, 124, 235],
  yellow: [244, 201, 93],
  green: [99, 185, 149],
  red: [232, 121, 121],
  gray: [100, 116, 139],
  lightGray: [226, 232, 240],
  dark: [15, 23, 42],
  white: [255, 255, 255],
};

const safeNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const safeText = (value, fallback = "N/A") => {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return String(value);
};

const formatNumber = (value) =>
  safeNumber(value).toLocaleString();

const formatDate = () =>
  new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });

/* =========================================================
   HEADER
========================================================= */

const drawHeader = (doc, title, subtitle = "") => {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...COLORS.navy);
  doc.rect(0, 0, pageWidth, 16, "F");

  doc.setTextColor(...COLORS.navy);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(title, pageWidth / 2, 32, {
    align: "center",
  });

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);
    doc.text(subtitle, pageWidth / 2, 39, {
      align: "center",
    });
  }
};

const drawSectionTitle = (doc, title, y) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...COLORS.dark);
  doc.text(title, 15, y);

  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.4);
  doc.line(15, y + 3, 195, y + 3);

  return y + 10;
};

/* =========================================================
   SUMMARY TABLE
========================================================= */

const drawSummaryTable = (doc, summary, y) => {
  const rows = [
    [
      "Total Patients",
      formatNumber(summary.totalPatients),
    ],
    [
      "Total Volunteers",
      formatNumber(summary.totalUsers),
    ],
    [
      "Total Medicines",
      formatNumber(summary.totalMedicines),
    ],
    [
      "Low Stock Medicines",
      formatNumber(summary.lowStock),
    ],
    [
      "Out of Stock Medicines",
      formatNumber(summary.outOfStock),
    ],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: rows,
    theme: "grid",

    headStyles: {
      fillColor: COLORS.blue,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },

    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.dark,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: {
        cellWidth: 120,
      },
      1: {
        cellWidth: 60,
      },
    },

    margin: {
      left: 15,
      right: 15,
    },
  });

  return doc.lastAutoTable.finalY + 15;
};

/* =========================================================
   DIAGNOSIS TABLE
========================================================= */

const drawDiagnosisTable = (
  doc,
  diagnosisData,
  y
) => {
  const rows = [...diagnosisData]
    .filter(
      (item) =>
        safeNumber(item?.value) > 0
    )
    .sort(
      (a, b) =>
        safeNumber(b?.value) -
        safeNumber(a?.value)
    )
    .map((item) => [
      safeText(item?.name),
      formatNumber(item?.value),
    ]);

  if (rows.length === 0) {
    rows.push(["No diagnosis data available", "0"]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Diagnosis", "Count"]],
    body: rows,
    theme: "grid",

    headStyles: {
      fillColor: COLORS.blue,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },

    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.dark,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: {
        cellWidth: 120,
      },
      1: {
        cellWidth: 60,
      },
    },

    margin: {
      left: 15,
      right: 15,
    },
  });

  return doc.lastAutoTable.finalY + 15;
};

/* =========================================================
   MEDICINE TABLE
========================================================= */

const drawMedicineTable = (
  doc,
  topMedicines,
  y
) => {
  const rows = [...topMedicines]
    .filter(
      (item) =>
        safeNumber(item?.count) > 0
    )
    .sort(
      (a, b) =>
        safeNumber(b?.count) -
        safeNumber(a?.count)
    )
    .map((item) => [
      safeText(item?.medicine),
      formatNumber(item?.count),
    ]);

  if (rows.length === 0) {
    rows.push([
      "No medicine usage data available",
      "0",
    ]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Medicine", "Prescriptions"]],
    body: rows,
    theme: "grid",

    headStyles: {
      fillColor: COLORS.blue,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },

    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.dark,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    columnStyles: {
      0: {
        cellWidth: 120,
      },
      1: {
        cellWidth: 60,
      },
    },

    margin: {
      left: 15,
      right: 15,
    },
  });

  return doc.lastAutoTable.finalY + 15;
};

/* =========================================================
   BAR CHART
========================================================= */

const drawBarChart = (
  doc,
  {
    title,
    data,
    labelKey,
    valueKey,
    color = COLORS.blue,
    y,
    height = 70,
  }
) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  const chartX = 25;
  const chartY = y + 12;
  const chartWidth = pageWidth - 45;
  const chartHeight = height;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.dark);
  doc.text(title, 15, y);

  const validData = (data || [])
    .filter(
      (item) =>
        safeNumber(item?.[valueKey]) > 0
    )
    .slice(0, 10);

  if (validData.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);
    doc.text(
      "No chart data available.",
      chartX,
      chartY + 15
    );

    return chartY + chartHeight + 10;
  }

  const maxValue = Math.max(
    ...validData.map((item) =>
      safeNumber(item?.[valueKey])
    )
  );

  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.4);

  /* Horizontal grid lines */

  for (let i = 0; i <= 4; i += 1) {
    const gridY =
      chartY +
      chartHeight -
      (i / 4) * chartHeight;

    doc.line(
      chartX,
      gridY,
      chartX + chartWidth,
      gridY
    );

    const gridValue =
      Math.round((maxValue * i) / 4);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      formatNumber(gridValue),
      chartX - 3,
      gridY + 2,
      {
        align: "right",
      }
    );
  }

  const gap = 5;

  const barWidth =
    (chartWidth -
      gap * (validData.length - 1)) /
    validData.length;

  validData.forEach((item, index) => {
    const value = safeNumber(
      item?.[valueKey]
    );

    const barHeight =
      maxValue > 0
        ? (value / maxValue) *
          (chartHeight - 10)
        : 0;

    const x =
      chartX +
      index * (barWidth + gap);

    const barY =
      chartY +
      chartHeight -
      barHeight;

    doc.setFillColor(...color);

    doc.roundedRect(
      x,
      barY,
      Math.max(barWidth, 5),
      barHeight,
      1.5,
      1.5,
      "F"
    );

    const label = safeText(
      item?.[labelKey],
      ""
    );

    const shortLabel =
      label.length > 12
        ? `${label.substring(0, 12)}...`
        : label;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      shortLabel,
      x + barWidth / 2,
      chartY + chartHeight + 8,
      {
        align: "center",
      }
    );

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.dark);

    doc.text(
      formatNumber(value),
      x + barWidth / 2,
      barY - 2,
      {
        align: "center",
      }
    );
  });

  return chartY + chartHeight + 20;
};

/* =========================================================
   PATIENT ACTIVITY CHART
========================================================= */

const drawPatientActivityChart = (
  doc,
  patientTrends,
  y
) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  const chartX = 25;
  const chartY = y + 15;
  const chartWidth = pageWidth - 45;
  const chartHeight = 75;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.dark);

  doc.text(
    "Patient Activity",
    15,
    y
  );

  const data = (patientTrends || [])
    .filter((item) => {
      return (
        safeNumber(item?.patients) > 0 ||
        safeNumber(item?.volunteers) > 0 ||
        safeNumber(item?.prescriptions) > 0
      );
    })
    .slice(-12);

  if (data.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      "No patient activity data available.",
      chartX,
      chartY + 20
    );

    return chartY + chartHeight + 15;
  }

  const maxValue = Math.max(
    ...data.flatMap((item) => [
      safeNumber(item?.patients),
      safeNumber(item?.volunteers),
      safeNumber(item?.prescriptions),
    ])
  );

  doc.setDrawColor(...COLORS.lightGray);
  doc.setLineWidth(0.4);

  for (let i = 0; i <= 4; i += 1) {
    const gridY =
      chartY +
      chartHeight -
      (i / 4) * chartHeight;

    doc.line(
      chartX,
      gridY,
      chartX + chartWidth,
      gridY
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      formatNumber(
        Math.round((maxValue * i) / 4)
      ),
      chartX - 3,
      gridY + 2,
      {
        align: "right",
      }
    );
  }

  const groupWidth =
    chartWidth / data.length;

  const barWidth =
    Math.max(
      3,
      (groupWidth - 8) / 3
    );

  const series = [
    {
      key: "patients",
      color: COLORS.navy,
    },
    {
      key: "volunteers",
      color: COLORS.lightBlue,
    },
    {
      key: "prescriptions",
      color: [182, 197, 255],
    },
  ];

  data.forEach((item, index) => {
    const baseX =
      chartX +
      index * groupWidth +
      3;

    series.forEach(
      (seriesItem, seriesIndex) => {
        const value = safeNumber(
          item?.[seriesItem.key]
        );

        const barHeight =
          maxValue > 0
            ? (value / maxValue) *
              (chartHeight - 10)
            : 0;

        const x =
          baseX +
          seriesIndex * (barWidth + 1);

        const barY =
          chartY +
          chartHeight -
          barHeight;

        doc.setFillColor(
          ...seriesItem.color
        );

        doc.roundedRect(
          x,
          barY,
          barWidth,
          barHeight,
          1,
          1,
          "F"
        );
      }
    );

    const label = safeText(
      item?.month,
      ""
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      label,
      baseX + groupWidth / 2 - 3,
      chartY + chartHeight + 8,
      {
        align: "center",
      }
    );
  });

  /* LEGEND */

  const legendY =
    chartY + chartHeight + 18;

  const legend = [
    ["Patients", COLORS.navy],
    ["Volunteers", COLORS.lightBlue],
    ["Prescriptions", [182, 197, 255]],
  ];

  let legendX = chartX;

  legend.forEach(([label, color]) => {
    doc.setFillColor(...color);

    doc.circle(
      legendX,
      legendY,
      1.8,
      "F"
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      label,
      legendX + 4,
      legendY + 2
    );

    legendX +=
      label.length * 1.7 + 25;
  });

  return legendY + 10;
};

/* =========================================================
   INVENTORY SUMMARY
========================================================= */

const drawInventorySummary = (
  doc,
  summary,
  y
) => {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.dark);

  doc.text(
    "Inventory Summary",
    15,
    y
  );

  autoTable(doc, {
    startY: y + 7,
    head: [["Inventory Metric", "Value"]],
    body: [
      [
        "Total Medicines",
        formatNumber(summary.totalMedicines),
      ],
      [
        "Low Stock",
        formatNumber(summary.lowStock),
      ],
      [
        "Out of Stock",
        formatNumber(summary.outOfStock),
      ],
    ],
    theme: "grid",

    headStyles: {
      fillColor: COLORS.blue,
      textColor: COLORS.white,
      fontStyle: "bold",
      fontSize: 9,
    },

    bodyStyles: {
      fontSize: 9,
      textColor: COLORS.dark,
    },

    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },

    margin: {
      left: 15,
      right: 15,
    },
  });

  return doc.lastAutoTable.finalY + 10;
};

/* =========================================================
   FOOTER
========================================================= */

const addFooter = (doc) => {
  const pageCount =
    doc.internal.getNumberOfPages();

  for (
    let page = 1;
    page <= pageCount;
    page += 1
  ) {
    doc.setPage(page);

    const pageHeight =
      doc.internal.pageSize.getHeight();

    const pageWidth =
      doc.internal.pageSize.getWidth();

    doc.setDrawColor(...COLORS.lightGray);
    doc.setLineWidth(0.3);

    doc.line(
      15,
      pageHeight - 14,
      pageWidth - 15,
      pageHeight - 14
    );

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.gray);

    doc.text(
      "RAMHIS — Medical Dashboard Report",
      15,
      pageHeight - 8
    );

    doc.text(
      `Page ${page} of ${pageCount}`,
      pageWidth - 15,
      pageHeight - 8,
      {
        align: "right",
      }
    );
  }
};

/* =========================================================
   MAIN GENERATOR
========================================================= */

export const generateDashboardPDF = ({
  summary = {},
  patientTrends = [],
  diagnosisData = [],
  topMedicines = [],
}) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  /* =====================================================
     PAGE 1
  ====================================================== */

  drawHeader(
    doc,
    "Medical Dashboard Report",
    `Generated on ${formatDate()}`
  );

  let y = 53;

  y = drawSectionTitle(
    doc,
    "Dashboard Summary",
    y
  );

  y = drawSummaryTable(
    doc,
    summary,
    y
  );

  y = drawSectionTitle(
    doc,
    "Diagnosis Distribution",
    y
  );

  y = drawDiagnosisTable(
    doc,
    diagnosisData,
    y
  );

  /*
   * If page 1 is becoming too full, continue
   * on a fresh page.
   */

  if (y > 255) {
    doc.addPage();

    drawHeader(
      doc,
      "Medical Dashboard Report",
      "Dashboard Analytics"
    );

    y = 53;
  }

  y = drawSectionTitle(
    doc,
    "Top Prescribed Medicines",
    y
  );

  drawMedicineTable(
    doc,
    topMedicines,
    y
  );

  /* =====================================================
     PAGE 2
  ====================================================== */

  doc.addPage();

  drawHeader(
    doc,
    "Medical Dashboard Report",
    "Activity Analytics"
  );

  y = 53;

  y = drawPatientActivityChart(
    doc,
    patientTrends,
    y
  );

  y += 12;

  y = drawBarChart(doc, {
    title: "Medicine Usage",
    data: topMedicines,
    labelKey: "medicine",
    valueKey: "count",
    color: COLORS.navy,
    y,
    height: 75,
  });

  y += 12;

  drawInventorySummary(
    doc,
    summary,
    y
  );

  /* FOOTERS */

  addFooter(doc);

  return doc.output("blob");
};

export default generateDashboardPDF;