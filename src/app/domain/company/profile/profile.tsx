import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import axios from "axios";
import "./profile.scss";

interface CompanyDetails {
  name: string;
  address: string;
  description: string;
  supervisorName: string;
  contactNo: string;
  email: string;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = React.useState<CompanyDetails>({
    name: "",
    address: "",
    description: "",
    supervisorName: "",
    contactNo: "",
    email: "",
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const companyId = localStorage.getItem("company_id");
    if (!companyId) {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
      return;
    }

    // Fetch company profile data
    axios.get(`${API_BASE_URL}/api/company-profile`, {
      params: { company_id: companyId }
    })
    .then(response => {
      setCompanyDetails(response.data);
    })
    .catch(error => {
      console.error("Error fetching company profile:", error);
      alert("Failed to load company profile");
    });
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof CompanyDetails
  ) => {
    setCompanyDetails(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSave = () => {
    const companyId = localStorage.getItem("company_id");
    if (!companyId) return;

    axios.put(`${API_BASE_URL}/api/company-profile`, companyDetails, {
      params: { company_id: companyId }
    })
    .then(() => {
      alert("Profile updated successfully!");
      navigate("/comdashboard");
    })
    .catch(error => {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    });
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Company Profile</h2>
        <button className="save-button" onClick={handleSave}>
          Save Changes
        </button>
      </div>

      <div className="profile-content">
        <div className="two-column-layout">
          <div className="column">
            <div className="profile-section">
              <h3 className="section-title">
                <FaBuilding className="section-icon" />
                Company Information
              </h3>

              <div className="form-group">
                <label>Company Name</label>
                <div className="input-wrapper">
                  <FaBuilding className="input-icon" />
                  <input
                    type="text"
                    value={companyDetails.name}
                    onChange={(e) => handleInputChange(e, "name")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <div className="input-wrapper">
                  <FaMapMarkerAlt className="input-icon" />
                  <input
                    type="text"
                    value={companyDetails.address}
                    onChange={(e) => handleInputChange(e, "address")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Company Description</label>
                <textarea
                  value={companyDetails.description}
                  onChange={(e) => handleInputChange(e, "description")}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="profile-section">
              <h3 className="section-title">
                <FaUser className="section-icon" />
                Supervisor Information
              </h3>

              <div className="form-group">
                <label>Supervisor Name</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    value={companyDetails.supervisorName}
                    onChange={(e) => handleInputChange(e, "supervisorName")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Number</label>
                <div className="input-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    type="text"
                    value={companyDetails.contactNo}
                    onChange={(e) => handleInputChange(e, "contactNo")}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    value={companyDetails.email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;