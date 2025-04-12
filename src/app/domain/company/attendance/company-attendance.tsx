import React, { useState, useEffect } from "react";
import "./company-attendance.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const CompanyAttendance: React.FC = () => {
  interface AttendanceItem {
    time_id?: string;
    date?: string;
    student_name?: string;
    company_name?: string;
    am_in?: string;
    am_out?: string;
    pm_in?: string;
    pm_out?: string;
    location?: string;
    address?: string;
  }

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [attendanceData, setAttendanceData] = useState<AttendanceItem[]>([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapCoords, setMapCoords] = useState<[number, number] | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [originalData, setOriginalData] = useState<AttendanceItem[]>([]);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) {
      setIsLoading(true);
      fetch(`${API_BASE_URL}/api/intern-attendance?company_id=${storedCompanyId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          const updatedDataPromises = data.map(async (item: any) => {
            if (item.location && item.location.includes(",")) {
              const [lat, lon] = item.location.split(",").map(Number);
              const fullAddress = await fetchAddress(lat, lon);
              item.address = formatAddress(fullAddress);
            }
            return item;
          });

          Promise.all(updatedDataPromises).then((updatedData) => {
            setAttendanceData(updatedData);
            setOriginalData(updatedData);
            setIsLoading(false);
          });
        })
        .catch((error) => {
          console.error("Error fetching attendance data:", error);
          alert("Error fetching attendance data. Please try again later.");
          setIsLoading(false);
        });
    } else {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchAddress = async (lat: number, lon: number): Promise<any> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching address:", error);
      return { display_name: "Unknown Address" };
    }
  };

  const formatAddress = (addressData: any): string => {
    const barangay =
      addressData.address?.suburb || addressData.address?.neighbourhood || "";
    const municipality =
      addressData.address?.city || addressData.address?.town || "";
    const province = addressData.address?.state || "";

    return [barangay, municipality, province].filter(Boolean).join(", ");
  };

  const openMapModal = (location: string) => {
    if (location.includes(",")) {
      const [lat, lon] = location.split(",").map(Number);
      setMapCoords([lat, lon]);
      fetchAddress(lat, lon).then((address) =>
        setSelectedAddress(formatAddress(address))
      );
      setShowMapModal(true);
    }
  };

  const closeMapModal = () => {
    setShowMapModal(false);
    setMapCoords(null);
    setSelectedAddress(null);
  };

  const columns = [
    { header: "Date", key: "date" },
    { header: "Student Name", key: "student_name" },
    {
      header: "Morning",
      key: "morning",
      render: (row: any) => (
        <div>
          <p><strong>In:</strong> {row.am_in || "N/A"}</p>
          <p><strong>Out:</strong> {row.am_out || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Afternoon",
      key: "afternoon",
      render: (row: any) => (
        <div>
          <p><strong>In:</strong> {row.pm_in || "N/A"}</p>
          <p><strong>Out:</strong> {row.pm_out || "N/A"}</p>
        </div>
      ),
    },
    {
      header: "Location",
      key: "address",
      render: (row: any) => (
        <span
          className="clickable-location"
          onClick={() => openMapModal(row.location)}
        >
          {row.address || row.location}
        </span>
      ),
    },
  ];

  const handleSearch = (query: string) => {
    if (!query) {
      setAttendanceData(originalData);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = originalData.filter((item) => {
      return (
        (item.student_name?.toLowerCase() || "").includes(lowerQuery) ||
        (item.company_name?.toLowerCase() || "").includes(lowerQuery) ||
        (item.date?.toLowerCase() || "").includes(lowerQuery) ||
        (item.address?.toLowerCase() || "").includes(lowerQuery)
      );
    });

    setAttendanceData(filtered);
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Attendance</h1>
      <h2 className="page-subtitle">Check Student Attendances</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search " onSearch={handleSearch} />
        </div>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="loading-text">Loading</p>
        </div>
      ) : (
        <DataTable columns={columns} data={attendanceData} />
      )}

      {showMapModal && mapCoords && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={closeMapModal}>
              &times;
            </span>
            <h3>Location: {selectedAddress}</h3>
            <MapContainer
              center={mapCoords}
              zoom={15}
              style={{ height: "600px", width: "95%" }}
              attributionControl={true}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={mapCoords}>
                <Popup>{selectedAddress}</Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      )}

      <style>
        {`
          .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 200px;
            gap: 1.5rem;
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          }

          .spinner {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: conic-gradient(
              from 0deg at 50% 50%,
              rgba(52, 152, 219, 0) 0%,
              #3498db 25%,
              #2ecc71 50%,
              #3498db 75%,
              rgba(52, 152, 219, 0) 100%
            );
            mask: radial-gradient(farthest-side, rgba(0,0,0,0) 65%, #000 66%);
            -webkit-mask: radial-gradient(farthest-side, rgba(0,0,0,0) 65%, #000 66%);
            animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite, 
                      pulse 2s ease-in-out infinite;
            position: relative;
          }

          .spinner::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(45deg, #3498db 0%, #2ecc71 100%);
            border-radius: 50%;
            mask: inherit;
            -webkit-mask: inherit;
          }

          @keyframes spin {
            0% { transform: rotate(0deg) scale(1); }
            50% { transform: rotate(180deg) scale(1.05); }
            100% { transform: rotate(360deg) scale(1); }
          }

          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }

          .loading-text {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell;
            color: #2c3e50;
            font-size: 1.1rem;
            font-weight: 500;
            letter-spacing: 0.05em;
            position: relative;
          }

          .loading-text::after {
            content: '...';
            position: absolute;
            animation: dots 1.5s infinite;
          }

          @keyframes dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
          }
          
          .modal {
            display: block;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
          }

          .modal-content {
            background-color: #fff;
            margin: 1% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 90%;
            max-width: 1200px; 
          }

          .close-button {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
          }

          .close-button:hover,
          .close-button:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
          }

          .clickable-location {
            color: blue;
            text-decoration: underline;
            cursor: pointer;
          }

          .clickable-location:hover {
            text-decoration: none;
          }
        `}
      </style>
    </div>
  );
};

export default CompanyAttendance;