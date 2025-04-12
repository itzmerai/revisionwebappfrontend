import React, { useState, useEffect } from "react";
import "./com-progress.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import "leaflet/dist/leaflet.css";

interface InternProgressData {
  school_id: string;
  student_name: string;
  task: string;
  progress: number;
}

const CompanyInternProgress: React.FC = () => {
  const [originalData, setOriginalData] = useState<InternProgressData[]>([]);
  const [internprogressData, setInternProgressData] = useState<InternProgressData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [taskFilter, setTaskFilter] = useState<string | null>(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCompanyId = localStorage.getItem("company_id");
        if (!storedCompanyId) {
          throw new Error("Company ID not found in localStorage");
        }

        const response = await fetch(
          `${API_BASE_URL}/api/intern-progress?company_id=${storedCompanyId}`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setOriginalData(data);
        setInternProgressData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch intern progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Create filter options from unique tasks
  const taskFilterOptions = Array.from(new Set(originalData.map(item => item.task)))
    .map(task => ({ label: task, value: task }));

  useEffect(() => {
    let filteredData = [...originalData];

    // Apply task filter
    if (taskFilter) {
      filteredData = filteredData.filter(item => item.task === taskFilter);
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
  }, [originalData, taskFilter, searchQuery]);

  const columns = [
    { header: "School Id", key: "school_id" },
    { header: "Student Name", key: "student_name" },
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
    return <div className="dashboard-page">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-page">Error: {error}</div>;
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
            filterOptions={taskFilterOptions}
            onFilter={setTaskFilter}
          />
        </div>
      </div>

      {internprogressData.length > 0 ? (
        <DataTable columns={columns} data={internprogressData} />
      ) : (
        <div className="no-data">No intern progress data available</div>
      )}
    </div>
  );
};

export default CompanyInternProgress;