import React, { useState } from "react";
import jsPDF from "jspdf";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

function Dashboard() {
  const [reports, setReports] = useState([]);

  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const [score, setScore] = useState("");
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  const addReport = () => {
    if (!company || !category || !score) {
      alert("Please fill all fields");
      return;
    }

    if (editId !== null) {
      const updatedReports = reports.map((report) =>
        report.id === editId
          ? {
              ...report,
              company,
              category,
              score: Number(score),
            }
          : report
      );

      setReports(updatedReports);

      setEditId(null);

      alert("Report Updated Successfully");
    } else {
      const newReport = {
        id: reports.length + 1,
        company,
        category,
        score: Number(score),
      };

      setReports([...reports, newReport]);

      alert("Report Added Successfully");
    }

    setCompany("");
    setCategory("");
    setScore("");
  };

  const deleteReport = (id) => {
    const filtered = reports.filter((report) => report.id !== id);
    setReports(filtered);
  };

  const editReport = (report) => {
    setCompany(report.company);
    setCategory(report.category);
    setScore(report.score);
    setEditId(report.id);
  };

  const exportCSV = () => {
    let csv = "ID,Company,Category,Score\n";

    reports.forEach((report) => {
      csv += `${report.id},${report.company},${report.category},${report.score}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "esg_reports.csv";

    a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);

    doc.text("ESG REPORT", 20, 20);

    let y = 40;

    reports.forEach((report) => {
      doc.text(
        `${report.id} | ${report.company} | ${report.category} | ${report.score}`,
        20,
        y
      );

      y += 10;
    });

    doc.save("esg_reports.pdf");
  };

  const filteredReports = reports.filter((report) =>
    report.company.toLowerCase().includes(search.toLowerCase())
  );

  const totalReports = reports.length;

  const averageScore =
    reports.length > 0
      ? (
          reports.reduce((sum, report) => sum + report.score, 0) /
          reports.length
        ).toFixed(1)
      : 0;

  const highestScore =
    reports.length > 0
      ? Math.max(...reports.map((r) => r.score))
      : 0;

  const lowestScore =
    reports.length > 0
      ? Math.min(...reports.map((r) => r.score))
      : 0;

  const COLORS = [
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#0088FE",
    "#AF19FF",
  ];

  return (
    <div style={container}>
      <h1 style={title}>ESG Dashboard</h1>

      <div style={cardContainer}>
        <div style={card}>
          <h2>Total Reports</h2>
          <h1>{totalReports}</h1>
        </div>

        <div style={card}>
          <h2>Average Score</h2>
          <h1>{averageScore}</h1>
        </div>

        <div style={card}>
          <h2>Highest Score</h2>
          <h1>{highestScore}</h1>
        </div>

        <div style={card}>
          <h2>Lowest Score</h2>
          <h1>{lowestScore}</h1>
        </div>
      </div>

      <div style={formContainer}>
        <input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={input}
        >
          <option value="">Select ESG Category</option>
          <option value="Environment">Environment</option>
          <option value="Social">Social</option>
          <option value="Governance">Governance</option>
        </select>

        <input
          type="number"
          placeholder="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          style={input}
        />

        <button onClick={addReport} style={button}>
          {editId !== null ? "Update Report" : "Add Report"}
        </button>

        <button onClick={exportCSV} style={csvButton}>
          Export CSV
        </button>

        <button onClick={exportPDF} style={pdfButton}>
          Export PDF
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Company..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={searchInput}
      />

      <table style={table}>
        <thead>
          <tr>
            <th style={thtd}>ID</th>
            <th style={thtd}>Company</th>
            <th style={thtd}>Category</th>
            <th style={thtd}>Score</th>
            <th style={thtd}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id}>
              <td style={thtd}>{report.id}</td>
              <td style={thtd}>{report.company}</td>
              <td style={thtd}>{report.category}</td>
              <td style={thtd}>{report.score}</td>

              <td style={thtd}>
                <button
                  onClick={() => editReport(report)}
                  style={editButton}
                >
                  Update
                </button>

                <button
                  onClick={() => deleteReport(report.id)}
                  style={deleteButton}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1 style={analyticsTitle}>ESG Score Analytics</h1>

      <div style={chartContainer}>
        <div style={chartBox}>
          <h2>Pie Chart</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reports}
                dataKey="score"
                nameKey="company"
                outerRadius={100}
                label
              >
                {reports.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h2>Bar Graph</h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reports}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="company" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar dataKey="score" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const container = {
  background: "#041c6b",
  minHeight: "100vh",
  padding: "30px",
  color: "white",
  fontFamily: "Arial",
};

const title = {
  textAlign: "center",
  fontSize: "60px",
  marginBottom: "30px",
};

const cardContainer = {
  display: "flex",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: "20px",
  marginBottom: "40px",
};

const card = {
  background: "linear-gradient(135deg,#2563eb,#38bdf8)",
  padding: "30px",
  width: "250px",
  borderRadius: "20px",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
};

const formContainer = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "center",
  marginBottom: "30px",
};

const input = {
  padding: "18px",
  width: "250px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "18px",
  background: "white",
  color: "black",
};

const searchInput = {
  padding: "18px",
  width: "500px",
  borderRadius: "12px",
  border: "1px solid #ccc",
  fontSize: "18px",
  background: "white",
  color: "black",
  display: "block",
  margin: "0 auto 30px auto",
};

const button = {
  background: "linear-gradient(135deg,#06beb6,#48b1bf)",
  color: "white",
  border: "none",
  padding: "18px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "18px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
};

const csvButton = {
  background: "linear-gradient(135deg,#7f7fd5,#86a8e7)",
  color: "white",
  border: "none",
  padding: "18px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "18px",
};

const pdfButton = {
  background: "linear-gradient(135deg,#ff416c,#ff4b2b)",
  color: "white",
  border: "none",
  padding: "18px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "18px",
};

const table = {
  width: "100%",
  background: "white",
  borderRadius: "15px",
  overflow: "hidden",
  color: "black",
  marginBottom: "50px",
};

const thtd = {
  padding: "20px",
  textAlign: "center",
  borderBottom: "1px solid #ddd",
  fontSize: "22px",
};

const deleteButton = {
  background: "linear-gradient(135deg,#ff512f,#dd2476)",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const editButton = {
  background: "linear-gradient(135deg,#f39c12,#f1c40f)",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  marginRight: "10px",
};

const analyticsTitle = {
  textAlign: "center",
  fontSize: "55px",
  marginBottom: "30px",
};

const chartContainer = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "30px",
};

const chartBox = {
  background: "white",
  padding: "20px",
  borderRadius: "20px",
  width: "600px",
  color: "black",
};

export default Dashboard;