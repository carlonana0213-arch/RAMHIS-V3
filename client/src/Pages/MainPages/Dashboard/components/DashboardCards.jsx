import {
  FaUserInjured,
  FaUsers,
  FaCapsules,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
} from "react-icons/fa";

function DashboardCards({ summary = {} }) {
  const patientDiff = Number(summary.patientIncrease || 0);
  const userDiff = Number(summary.userIncrease || 0);

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e5eaf2",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
    minWidth: 0,
  };

  const iconStyle = {
    width: "52px",
    height: "52px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "21px",
    flexShrink: 0,
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "18px",
        marginTop: "30px",
      }}
    >
      {/* PATIENTS */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "10px",
              }}
            >
              Total Patients
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "34px",
                lineHeight: 1,
                fontWeight: 750,
                color: "#0f172a",
                letterSpacing: "-1px",
              }}
            >
              {(summary.totalPatients || 0).toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              ...iconStyle,
              background: "#eff6ff",
              color: "#2563eb",
            }}
          >
            <FaUserInjured />
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "16px",
            borderTop: "1px solid #eef2f7",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            color: patientDiff >= 0 ? "#16a34a" : "#dc2626",
            fontWeight: 600,
          }}
        >
          {patientDiff >= 0 ? <FaArrowUp /> : <FaArrowDown />}

          <span>
            {Math.abs(summary.currentPatients || 0).toLocaleString()} patients
            added this month
          </span>
        </div>
      </div>

      {/* VOLUNTEERS */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "10px",
              }}
            >
              Total Volunteers
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "34px",
                lineHeight: 1,
                fontWeight: 750,
                color: "#0f172a",
                letterSpacing: "-1px",
              }}
            >
              {(summary.totalUsers || 0).toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              ...iconStyle,
              background: "#ecfdf3",
              color: "#16a34a",
            }}
          >
            <FaUsers />
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "16px",
            borderTop: "1px solid #eef2f7",
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "12px",
            color: userDiff >= 0 ? "#16a34a" : "#dc2626",
            fontWeight: 600,
          }}
        >
          {userDiff >= 0 ? <FaArrowUp /> : <FaArrowDown />}

          <span>
            {Math.abs(userDiff).toLocaleString()} compared to previous month
          </span>
        </div>
      </div>

      {/* MEDICINES */}
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div>
            <span
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: "#64748b",
                marginBottom: "10px",
              }}
            >
              Total Medicines
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "34px",
                lineHeight: 1,
                fontWeight: 750,
                color: "#0f172a",
                letterSpacing: "-1px",
              }}
            >
              {(summary.totalMedicines || 0).toLocaleString()}
            </strong>
          </div>

          <div
            style={{
              ...iconStyle,
              background: "#f5f3ff",
              color: "#7c3aed",
            }}
          >
            <FaCapsules />
          </div>
        </div>

        <div
          style={{
            marginTop: "22px",
            paddingTop: "16px",
            borderTop: "1px solid #eef2f7",
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 9px",
              borderRadius: "8px",
              background: "#fffbeb",
              color: "#d97706",
              fontSize: "11px",
              fontWeight: 650,
            }}
          >
            <FaExclamationTriangle />
            Low Stock: {summary.lowStock || 0}
          </span>

          <span
            style={{
              padding: "6px 9px",
              borderRadius: "8px",
              background: "#fef2f2",
              color: "#dc2626",
              fontSize: "11px",
              fontWeight: 650,
            }}
          >
            Out of Stock: {summary.outOfStock || 0}
          </span>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;