import { useState, useEffect } from "react";
import API from "../services/api";

function Home() {
  const [records, setRecords] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    company: "",
    industry: "",
    score: ""
  });

  // 🔥 FETCH DATA FROM BACKEND
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/records");
      setRecords(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // DELETE
  const handleDelete = (index) => {
    const updated = records.filter((_, i) => i !== index);
    setRecords(updated);
  };

  // EDIT
  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(records[index]);
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // UPDATE
  const handleUpdate = (e) => {
    e.preventDefault();

    const updated = [...records];
    updated[editIndex] = form;

    setRecords(updated);
    setEditIndex(null);
    setForm({ company: "", industry: "", score: "" });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>ESG Reporting Dashboard</h1>

      {/* EDIT FORM */}
      {editIndex !== null && (
        <form onSubmit={handleUpdate}>
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Company"
          />
          <input
            name="industry"
            value={form.industry}
            onChange={handleChange}
            placeholder="Industry"
          />
          <input
            name="score"
            value={form.score}
            onChange={handleChange}
            placeholder="Score"
          />
          <button type="submit">Update</button>
        </form>
      )}

      <br />

      {/* TABLE */}
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Company</th>
            <th>Industry</th>
            <th>ESG Score</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r, index) => (
            <tr key={index}>
              <td>{r.company}</td>
              <td>{r.industry}</td>
              <td>{r.score}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Home;