import React, { useEffect, useState } from "react";
import "./user-student.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";

const Student: React.FC = () => {
  interface Student {
    student_schoolid: string;
    coordinator_name: string;
    program_name: string;
    company_name: string;
    student_status: string;
    program_hours: number;
  }

  const [data, setData] = useState<Student[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [programFilter, setProgramFilter] = useState<string>("all");
  const [programOptions, setProgramOptions] = useState<Array<{ value: string; label: string }>>([]);

  // Generate program options from data
  useEffect(() => {
    if (data.length > 0) {
      const uniquePrograms = Array.from(new Set(data.map(student => student.program_name)))
        .sort()
        .map(program => ({
          value: program,
          label: program
        }));

      setProgramOptions([
        { value: "all", label: "All Programs" },
        ...uniquePrograms
      ]);
    }
  }, [data]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const columns = [
    { header: "Student ID", key: "student_schoolid" },
    { header: "Coordinator", key: "coordinator_name" },
    { header: "Program", key: "program_name" },
    { header: "Company", key: "company_name" },
    { header: "Required Duration", key: "program_hours" },
    { header: "Status", key: "student_status" },
  ];

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/studentsall`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStudents = data.filter((student) => {
    const matchesSearch = (
      student.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.program_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.coordinator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_schoolid.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const matchesProgram = programFilter === "all" || 
      student.program_name === programFilter;

    return matchesSearch && matchesProgram;
  });
  
  return (
    <div className="dashboard-page">
      <h1 className="page-title">User Management</h1>
      <h2 className="page-subtitle">Student Records</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar 
            placeholder="Search" 
            onSearch={handleSearch}
            filterOptions={programOptions}
            onFilter={setProgramFilter}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable columns={columns} data={filteredStudents} />
      )}
    </div>
  );
};

export default Student;