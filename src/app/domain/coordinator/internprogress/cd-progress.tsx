import React, { useState, useEffect } from "react";
import axios from "axios";
import "./cd-progress.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import "leaflet/dist/leaflet.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface InternProgressData {
  school_id: string;
  student_name: string;
  company: string;
  task: string;
  progress: number;
}

interface FilterOption {
  value: string;
  label: string;
}

const CoordinatorInternProgress: React.FC = () => {
  const [originalData, setOriginalData] = useState<InternProgressData[]>([]);
  const [internprogressData, setInternProgressData] = useState<InternProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string | null>(null);
  const [companyFilterOptions, setCompanyFilterOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCoordinatorId = localStorage.getItem("coordinator_id");
        if (!storedCoordinatorId) {
          throw new Error("Coordinator ID not found in local storage");
        }

        const response = await axios.get(
          `${API_BASE_URL}/intern-progress?coordinator_id=${storedCoordinatorId}`
        );

        setOriginalData(response.data);
        setInternProgressData(response.data);
        
        // Generate company filter options
        const companies = Array.from(new Set(response.data.map((item: InternProgressData) => item.company)))
          .map((company) => ({ value: company as string, label: company as string }));
        setCompanyFilterOptions(companies);
        
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch intern progress data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filteredData = [...originalData];

    // Apply company filter
    if (companyFilter) {
      filteredData = filteredData.filter(item => item.company === companyFilter);
    }

    // Apply search query
    if (searchQuery) {
      filteredData = filteredData.filter(item =>
        Object.values(item).some(val =>
          String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setInternProgressData(filteredData);
  }, [originalData, companyFilter, searchQuery]);

  const columns = [
    { header: "School Id", key: "school_id" },
    { header: "Student Name", key: "student_name" },
    { header: "Company", key: "company" },
    { header: "Task", key: "task" },
    {
      header: "Progress",
      key: "progress",
      render: (row: InternProgressData) => (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${row.progress}%` }}
            ></div>
          </div>
          <span className="progress-text">{row.progress}%</span>
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="dashboard-page">Loading intern progress...</div>;
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Intern Progress</h1>
      <h2 className="page-subtitle">Task Progress and Completion</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={setSearchQuery}
            filterOptions={companyFilterOptions}
            onFilter={setCompanyFilter}
          />
        </div>
      </div>

      <DataTable columns={columns} data={internprogressData} />
    </div>
  );
};

export default CoordinatorInternProgress;