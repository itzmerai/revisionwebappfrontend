import React, { useState, useEffect } from "react";
import "./admin-dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../../shared/components/sidebar/admin-sidebar";
import adminProfImage from "../../../../shared/assets/admin-profile.png";

const Dashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("overview");
  const [adminData, setAdminData] = useState<any>(null); // State to hold admin data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/admin");
        const admins = response.data;

        // Retrieve the current user's UUID from localStorage
        const storedUserDisplayData = JSON.parse(
          localStorage.getItem("userDisplayData") || "{}"
        );
        const loggedInAdminUUID = storedUserDisplayData.uuid;

        // Find the admin with the matching UUID
        const loggedInAdmin = admins.find(
          (admin: any) => admin.adminUUID === loggedInAdminUUID
        );

        if (loggedInAdmin) {
          setAdminData(loggedInAdmin);
        } else {
          console.error("Logged-in admin not found");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    navigate(`/dashboard/${item}`);
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="dashboard-container">
        <div className="profile-picture-container">
          <span className="admin-text">Administrator</span>
          <img src={adminProfImage} alt="" className="profile-picture" />
        </div>

        <Outlet context={{ adminData }} />
      </div>
    </div>
  );
};

export default Dashboard;