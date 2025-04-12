import React, { useState, useEffect } from "react";
import "./internshipreport.scss";
import SearchBar from "../../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../../shared/components/table/data-table";

const InternshipReport: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyId, setCompanyId] = useState<number | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Retrieve company_id from localStorage
  useEffect(() => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) {
      setCompanyId(parseInt(storedCompanyId, 10));
    } else {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  // Fetch student timesheet data when searchQuery or companyId changes
  useEffect(() => {
    if (companyId && searchQuery) {
      fetch(
        `${API_BASE_URL}/api/intern-report?company_id=${companyId}&searchQuery=${searchQuery}`
      )
        .then((response) => {
          if (!response.ok) throw new Error("Network response was not ok");
          return response.json();
        })
        .then((data) => {
          setAttendanceData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setAttendanceData([]);
        });
    } else {
      setAttendanceData([]);
    }
  }, [searchQuery, companyId]);

  const columns = [
    { header: "Student ID", key: "student_id" },
    { header: "Name", key: "student_name" },
    { header: "Date", key: "date" },
    {
      header: "Morning Session",
      key: "first_period",
      render: (row: any) => (
        <div className="studenttime">
          <p><strong>In:</strong> {row.am_in || "N/A"}</p>
          <p><strong>Out:</strong> {row.am_out || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Afternoon Session",
      key: "second_period",
      render: (row: any) => (
        <div className="studenttime">
          <p><strong>In:</strong> {row.pm_in || "N/A"}</p>
          <p><strong>Out:</strong> {row.pm_out || "N/A"}</p>
        </div>
      ),
    },
    { header: "Location", key: "location" },
  ];

  return (
    <div className="internship-report-container">
      <div className="search-wrapper">
        <SearchBar
          placeholder="Search student name..."
          onSearch={(query) => setSearchQuery(query)}
        />
      </div>

      <div className="content-wrapper">
        <DataTable 
          columns={columns} 
          data={attendanceData}
          loading={!companyId || !searchQuery}
        />
      </div>
    </div>
  );
};

export default InternshipReport;