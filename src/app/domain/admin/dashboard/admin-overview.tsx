import React, { useEffect, useState } from "react";
import axios from "axios";
import "./admin-overview.scss";
import {
  FaUsers,
  FaGraduationCap,
  FaBriefcase,
  FaBuilding,
} from "react-icons/fa";
import Card from "../../../../shared/components/cards/card";
import ProgressRingCard from "../../../../shared/components/charts/ring-chart";
import NewCoordinatorCard from "../../../../shared/components/new-coordinator/new-coordinator";
import ProgramBarChart from "../../../../shared/components/charts/pbar-chart";

const Overview: React.FC = () => {
  const [totalCoordinators, setTotalCoordinators] = useState<number | null>(
    null
  );
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [totalPrograms, setTotalPrograms] = useState<number | null>(null);
  const [totalCompanies, setTotalCompanies] = useState<number | null>(null);
  const [recentlyAddedCoordinators, setRecentlyAddedCoordinators] = useState<
    {
      id: number;
      name: string;
      registrationDate: string;
    }[]
  >([]);
  const [attendancePercentage, setAttendancePercentage] = useState<number | null>(null);
  const [programDistribution, setProgramDistribution] = useState<
  Array<{ program: string; student_count: number }>
>([]);

  useEffect(() => {
    const fetchTotalCoordinators = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/count-coordinators`
        );
        setTotalCoordinators(response.data.count); // Set the count of coordinators
      } catch (error) {
        console.error("Error fetching total coordinators:", error);
      }
    };

    const fetchTotalStudents = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/countall-students`
        );
        setTotalStudents(response.data.count);
      } catch (error) {
        console.error("Error fetching total students:", error);
      }
    };

    const fetchTotalPrograms = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/count-programs`
        ); // Adjust the port to match your backend port
        setTotalPrograms(response.data.count); // Set the count in your state
      } catch (error) {
        console.error("Error fetching total programs:", error);
      }
    };

    const fetchTotalCompanies = async () => {
      try {
        const response = await axios.get(
         `${API_BASE_URL}/countall-companies`
        );
        setTotalCompanies(response.data.count);
      } catch (error) {
        console.error("Error fetching total companies:", error);
      }
    };

    const fetchRecentlyAddedCoordinators = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/recent-coordinators`
        );
        setRecentlyAddedCoordinators(response.data.recentCoordinators);
      } catch (error) {
        console.error("Error fetching recently added coordinators:", error);
      }
    };

    const fetchAttendancePercentage = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/attendance-percentage`
        );
        
        // Add validation
        if (response.data?.percentage !== undefined) {
          setAttendancePercentage(Math.round(response.data.percentage));
        } else {
          console.error('Invalid percentage data:', response.data);
          setAttendancePercentage(0);
        }
      } catch (error) {
        console.error("Error fetching attendance percentage:", error);
        setAttendancePercentage(0);  // Set to 0 instead of leaving null
      }
    };
    const fetchProgramDistribution = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/programwise`
        );
        setProgramDistribution(response.data);
      } catch (error) {
        console.error("Error fetching program distribution:", error);
      }
    };
    fetchProgramDistribution();
    fetchTotalCoordinators();
    fetchTotalStudents();
    fetchTotalPrograms();
    fetchTotalCompanies();
    fetchRecentlyAddedCoordinators();
    fetchAttendancePercentage();
  }, []);

  return (
    <div className="overview">
      <div className="cards-grid">
        <div className="card-column">
          <Card
            label="Total Coordinators"
            value={
              totalCoordinators !== null ? totalCoordinators.toString() : "0"
            }
            icon={<FaUsers />}
            className="total-coordinator"
          />
          <Card
            label="Total Programs"
            value={totalPrograms !== null ? totalPrograms.toString() : "0"}
            icon={<FaBriefcase />}
            className="total-program"
          />
        </div>

        <div className="card-column">
          <Card
            label="Total Companies"
            value={totalCompanies !== null ? totalCompanies.toString() : "0"}
            icon={<FaBuilding />}
            className="total-company"
          />
          <Card
            label="Total Students"
            value={totalStudents !== null ? totalStudents.toString() : "0"}
            icon={<FaGraduationCap />}
            className="total-student"
          />
        </div>
        <ProgressRingCard percentage={attendancePercentage ?? 0} />
                {/* <div className="recent-coordinators">
          <h2>Recently Added Coordinators</h2>
          <div className="new-members-list">
            {recentlyAddedCoordinators.slice(0, 5).map((coordinator) => (
              <NewCoordinatorCard
                key={coordinator.id}
                profilePicture={coordinator.profilePicture}
                name={coordinator.name}
                registrationDate={coordinator.registrationDate}
              />
            ))}
          </div>
        </div>*/}
      </div>

      <div className="chart-two">
      <div className="chart-container">
             <h2>Program-wise Student Distribution</h2>
              <div style={{ height: 280 }}>
                <ProgramBarChart data={programDistribution} />
              </div>
      </div>
        <div className="recent-coordinators">
          <h2>Recently Added Coordinators</h2>
          <div className="new-members-list">
            {recentlyAddedCoordinators.slice(0, 5).map((coordinator) => (
              <NewCoordinatorCard
                key={coordinator.id}
                //profilePicture={coordinator.profilePicture}
                name={coordinator.name}
                registrationDate={coordinator.registrationDate}
              />
            ))}
          </div>
        </div>
        {/*<ProgressRingCard percentage={attendancePercentage} />*/}
      </div>
    </div>
  );
};

export default Overview;
