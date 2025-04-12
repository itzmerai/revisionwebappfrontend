import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../../../../../shared/components/table/data-table";

const SubmittedTaskFiles: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) {
      fetchStudents(storedCompanyId);
    } else {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchStudents = async (companyId: string) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/intern-documentation/students-with-uploads`,
        { params: { companyId } }
      );
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error loading student data");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUploads = (studentId: string) => {
    window.open(`/student-taskdocuments/${studentId}`, "_blank");
  };

  const columns = [
    { header: "Student ID", key: "student_id" },
    { header: "Student Name", key: "student_name" },
    { 
      header: "Uploads", 
      key: "upload_count",
      render: (row: any) => (
        <button 
          onClick={() => handleViewUploads(row.student_id)}
          className="text-blue-500 hover:underline"
        >
          View Uploads ({row.upload_count})
        </button>
      )
    },
  ];

  if (loading) return <div>Loading...</div>;

  return (
    <div className="submitted-files-container">
      {students.length === 0 ? (
        <p>No files submitted yet.</p>
      ) : (
        <DataTable columns={columns} data={students} />
      )}
    </div>
  );
};

export default SubmittedTaskFiles;