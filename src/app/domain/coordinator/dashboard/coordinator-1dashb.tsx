import React, { useState, useEffect } from "react";
import "./coordinator-dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../../shared/components/sidebar/coordinator-sidebar";
import maleImage from "../../../../shared/assets/male.png";
import femaleImage from "../../../../shared/assets/female.png";

const CDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("overview");
  const [coordinatorDetails, setCoordinatorDetails] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>(maleImage);
  const [coordinatorId, setCoordinatorId] = useState<string>("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Get coordinator ID from localStorage
  useEffect(() => {
    const storedCoordinatorId = localStorage.getItem("coordinator_id");
    if (storedCoordinatorId) {
      setCoordinatorId(storedCoordinatorId);
    } else {
      alert("Coordinator ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  // Fetch coordinator data when coordinatorId is available
  useEffect(() => {
    const fetchCoordinatorData = async () => {
      if (!coordinatorId) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/coordinatorwc?coordinator_id=${coordinatorId}`
        );

        if (response.data) {
          setCoordinatorDetails(response.data);

          // Set profile image based on gender from API response
          setProfileImage(
            response.data.gender === "Female" ? femaleImage : maleImage
          );
        }
      } catch (error) {
        console.error("Error fetching coordinator data:", error);
        alert("Error loading coordinator details");
      }
    };

    fetchCoordinatorData();
  }, [coordinatorId]);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    navigate(`/cddashboard/${item}`);
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="dashboard-container">
        <div className="profile-picture-container">
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <span
              style={{
                fontFamily: '"Montserrat", sans-serif',
                color: "grey",
                fontWeight: 500,
                fontSize: "18px",
                paddingTop: "2em",
                paddingRight: "1.4em",
              }}
            >
              {/* Display coordinator's first name or default text */}
              Coordinator{" "}
              {coordinatorDetails?.fullName?.split(" ")[0] || "Coordinator"}
            </span>
            <img
              src={profileImage}
              alt="Coordinator Profile"
              style={{
                width: "60px",
                height: "70px",
                borderRadius: "50%",
                objectFit: "cover",
                position: "relative",
                top: "1em",
                right: "2.3em",
              }}
            />
          </div>
        </div>
        <Outlet context={{ coordinatorDetails }} />
      </div>
    </div>
  );
};

export default CDashboard;
