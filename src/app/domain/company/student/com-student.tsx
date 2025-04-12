import  { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../../../shared/components/modals/modal";
import NameInputField from "../../../../shared/components/fields/unif";
import "./com-student.scss";

const ComStudent = () => {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [searchQuery, setSearchQuery] = useState("");
  const [studentData, setStudentData] = useState<any[]>([]);
  const [filteredStudentData, setFilteredStudentData] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [hoursToAdd, setHoursToAdd] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const companyId = localStorage.getItem("company_id");
        if (!companyId) {
          alert("Company ID not found. Please log in again.");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/interns`, {
          params: { company_id: companyId }
        });

        const formattedData = response.data.map((student: any) => ({
          ...student,
          rendered_time: `${student.rendered_time || 0} hrs`,
          student_status: student.student_status || "Pending"
        }));

        setStudentData(formattedData);
        setFilteredStudentData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching student data:", error);
        alert("Error fetching student data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  useEffect(() => {
    // Filter data based on search query
    const filtered = studentData.filter((student) => {
      return (
        student.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_schoolid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

    setFilteredStudentData(filtered);
  }, [searchQuery, studentData]);

  const handleRowClick = (student: any) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleModalSave = async () => {
    // Add validation for numeric input
    if (!hoursToAdd || isNaN(Number(hoursToAdd)) || Number(hoursToAdd) <= 0) {
      alert("Please enter a valid number of hours");
      return;
    }
  
    try {
      const response = await axios.post(`${API_BASE_URL}/api/idletime`, {
        student_id: selectedStudent.student_id,
        hours_added: Number(hoursToAdd) // Ensure numeric value
      });
  
      // Update local state with formatted values
      const updatedData = studentData.map((student) => {
        if (student.student_id === selectedStudent.student_id) {
          return {
            ...student,
            rendered_time: `${response.data.rendered_time} hrs`, // Format here
            student_status: response.data.time_status
          };
        }
        return student;
      });
  
      setStudentData(updatedData);
      setFilteredStudentData(updatedData);
      setShowModal(false);
      setHoursToAdd("");
      alert("Hours added successfully!");
    } catch (error) {
      console.error("Error adding hours:", error);
      alert("Failed to add hours. Please try again.");
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setHoursToAdd("");
  };

  const columns = [
    { header: "#", key: "student_id" },
    { header: "Student ID", key: "student_schoolid" },
    {
      header: "Student Info",
      key: "studentInfo",
      render: (row: any) => (
        <div className="student-info">
          <p>
            <strong>Name:</strong> {row.student_name || "N/A"}
          </p>
          <p>
            <strong>Address:</strong> {row.student_address || "N/A"}
          </p>
          <p>
            <strong>Contact #:</strong> {row.student_contact || "N/A"}
          </p>
        </div>
      ),
    },
    { header: "Sex", key: "student_sex" },
    { header: "Email", key: "student_email" },
    {
      header: "Rendered Time",
      key: "rendered_time",
      render: (row: any) => (
        <div className="rendered-time">{row.rendered_time}</div>
      ),
    },
    { header: "Status", key: "student_status" },
    {
      header: "Action",
      key: "action",
      render: (row: any) => (
        <div className="action-icons">
          <FontAwesomeIcon
            icon={faPlus}
            className="add-time-icon"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
            style={{ cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Student</h1>
      <h2 className="page-subtitle">Manage Student Attendance</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search"
            onSearch={(query) => setSearchQuery(query)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading student data...</p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredStudentData}
        />
      )}

      {/* Add Time Modal */}
      <Modal
        show={showModal}
        message={`Add rendered hours for ${
          selectedStudent?.student_name || "student"
        }`}
        title="Add Rendered Time"
        onCancel={handleModalCancel}
        onConfirm={handleModalSave}
        size="medium"
        cancelButtonText="Cancel"
        confirmButtonText="Add Hours"
      >
        <div className="modal-renderedtime">
          <div className="header-left">
            <h2 className="main-header">Add Rendered Time</h2>
            <h3 className="sub-header">
              Student: {selectedStudent?.student_name || "N/A"}
            </h3>
            <h3 className="sub-headerr">
              Current Hours: {selectedStudent?.rendered_time || "0 hrs"}
            </h3>
          </div>
        </div>

        <div className="modal-bodyhours">
          <div className="modal-time-input">
            <label htmlFor="hoursToAdd">Hours to Add</label>
            <NameInputField
              type="number"
              id="hoursToAdd"
              value={hoursToAdd}
              onChange={(e) => setHoursToAdd(e.target.value)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComStudent;