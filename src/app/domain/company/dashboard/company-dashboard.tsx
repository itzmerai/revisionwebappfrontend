import React, { useState, useEffect } from "react";
import "./company-dashboard.scss";
import { FaGraduationCap, FaTasks } from "react-icons/fa";
import Card from "../../../../shared/components/cards/card";
import BarChartCard from "../../../../shared/components/charts/bar-chart";
import welcomeGif from "../../../../shared/assets/welcome.gif";
import axios from "axios";

const CompanyDashboard: React.FC = () => {
  const [totalTasks, setTotalStask] = useState<number | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [taskDistribution, setTaskDistribution] = useState<{ x: string; y: number }[]>([]);
  const [recentlyAddedStudents, setRecentlyAddedStudents] = useState<
    {
      id: number;
      schoolId: string;
      name: string;
      companyName: string;
    }[]
  >([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const companyId = localStorage.getItem("company_id");
    if (!companyId) {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
      return;
    }

    // Fetch company mentor name
    axios.get(`${API_BASE_URL}/api/companygreet`, {
      params: { company_id: companyId }
    })
    .then(response => {
      setCompanyName(response.data.company_mentor || "Company");
    })
    .catch(error => {
      console.error("Error fetching company name:", error);
      setCompanyName("Company");
    });

    

    // Fetch total student count
    axios.get(`${API_BASE_URL}/api/count-interns`, { params: { company_id: companyId } })
      .then(response => {
        setTotalStudents(response.data.count || 0);
      })
      .catch(error => {
        console.error("Error fetching student count:", error);
        setTotalStudents(0);
      });

       // Fetch total task count
      axios.get(`${API_BASE_URL}/api/count-task`, { params: { company_id: companyId } })
      .then(response => {
        setTotalStask(response.data.count || 0);
      })
      .catch(error => {
        console.error("Error fetching student count:", error);
        setTotalStask(0);
      });
// fetch task distribution
      axios.get(`${API_BASE_URL}/api/task-distribution`, { params: { company_id: companyId } })
      .then(response => {
        setTaskDistribution(response.data);
      })
      .catch(error => {
        console.error("Error fetching task distribution:", error);
        setTaskDistribution([]);
      });

    // Fetch recently added interns
    axios.get(`${API_BASE_URL}/api/recent-interns`, {
      params: { company_id: companyId }
    })
    .then(response => {
      const formattedStudents = response.data.recentStudents.map((student: any) => ({
        id: student.student_id,
        schoolId: student.student_schoolid,
        name: student.student_name,
        companyName: "" // Add company name if available from API
      }));
      setRecentlyAddedStudents(formattedStudents);
    })
    .catch(error => {
      console.error("Error fetching recent interns:", error);
    });

  }, []);

  return (
    <div className="dashb">
      <div className="cards-wrapper">
        <div className="left-card">
          <h2>Hello there, {companyName || "Company"}!</h2>
          <img
            src={welcomeGif}
            alt="Person using a laptop"
            className="gif-image"
            width={250}
          />
        </div>
        <div className="right-cards">
          <Card
            label={
              <span>
                <FaGraduationCap className="icon-cap" /> Total Students:{" "}
                {totalStudents}
              </span>
            }
            width="80%"
            height="40%"
            className="total-students"
          />
          <Card
            label={
              <span>
                <FaTasks className="icon-task" /> Total Tasks:{" "}
                {totalTasks !== null ? totalTasks : 0}
              </span>
            }
            width="80%"
            height="40%"
            className="total-companies"
          />
        </div>
      </div>

      <div className="content-wrapper">
        <div className="recently-added-section">
          <h2>Recently Added Interns</h2>
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Student Name</th>
                </tr>
              </thead>
              <tbody>
                {recentlyAddedStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.schoolId}</td>
                    <td>{student.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="chart-container">
        <h2>Student-Task Distribution</h2>
        <BarChartCard 
          data={taskDistribution} 
          options={{
            xAxisLabel: 'Tasks',
            yAxisLabel: 'Number of Students',
            showLegend: false
          }}
        />
      </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;