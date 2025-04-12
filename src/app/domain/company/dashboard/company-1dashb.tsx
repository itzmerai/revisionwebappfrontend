import React, { useState, useEffect } from "react";
import "./company-dashboard.scss";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../../../shared/components/sidebar/company-sidebar";
import maleImage from "../../../../shared/assets/com.png";
import { FaBell } from "react-icons/fa";
import axios from "axios";

const ComDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("overview");
  const [companyName, setCompanyName] = useState<string>("");
  const [profileImage] = useState<string>(maleImage);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationError, setNotificationError] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const companyId = localStorage.getItem("company_id");
    if (!companyId) {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
      return;
    }

    // Fetch company name
    axios.get(`${API_BASE_URL}/api/comname`, {
      params: { company_id: companyId }
    })
    .then(response => {
      setCompanyName(response.data.company_name || "Company");
    })
    .catch(error => {
      console.error("Error fetching company name:", error);
      setCompanyName("Company");
    });
  }, []);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    navigate(`/comdashboard/${item}`);
  };

  const fetchNotifications = async (companyId: string) => {
    try {
      setLoadingNotifications(true);
      setNotificationError("");
      
      const response = await axios.get(`${API_BASE_URL}/api/company-announcement`, {
        params: { company_id: companyId }
      });

      const formattedNotifications = response.data.map((announcement: any) => ({
        id: announcement.announce_id,
        text: announcement.announcement_content,
        time: formatTime(announcement.announcement_date),
        type: announcement.announcement_type
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotificationError("Failed to load notifications");
    } finally {
      setLoadingNotifications(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} minutes ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const toggleNotifications = () => {
    const companyId = localStorage.getItem("company_id");
    if (!companyId) return;

    if (!showNotifications) {
      fetchNotifications(companyId);
    }
    setShowNotifications(!showNotifications);
  };

  const handleProfileClick = () => {
    navigate("/comdashboard/profile");
  };

  return (
    <div className="dashboard">
      <Sidebar activeItem={activeItem} onItemClick={handleItemClick} />
      <div className="dashboard-container">
        <div className="profile-picture-container">
          <div className="profile-notification-wrapper">
            <span className="company-name">
              {companyName || "Company"}
            </span>

            <div className="profile-image-wrapper" onClick={handleProfileClick}>
              <img
                src={profileImage}
                alt="Company Profile"
                className="company-profile-image"
              />
            </div>

            <div className="notification-icon-wrapper">
              <FaBell
                className="notification-icon"
                onClick={toggleNotifications}
              />
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </div>
          </div>

          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h4>Notifications</h4>
                <button className="mark-all-read">Mark all as read</button>
              </div>
              <div className="notifications-list">
                {loadingNotifications ? (
                  <div className="loading-notifications">Loading...</div>
                ) : notificationError ? (
                  <div className="notification-error">{notificationError}</div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <p>{notification.text}</p>
                      <span className="notification-time">
                        {notification.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-notifications">No new notifications</div>
                )}
              </div>
              <div className="notifications-footer">
                <button>View All Notifications</button>
              </div>
            </div>
          )}
        </div>
        <Outlet context={{ companyName }} />
      </div>
    </div>
  );
};

export default ComDashboard;