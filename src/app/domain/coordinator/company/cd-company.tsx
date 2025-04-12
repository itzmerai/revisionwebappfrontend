import React, { useState, useEffect } from "react";
import "./cd-company.scss";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import DataTable from "../../../../shared/components/table/data-table";
import {
  faEdit,
  faPlus,
  faExclamationTriangle,
  faUser,
  faPhone,
  faMapLocation,
  faBuilding,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import Modal from "../../../../shared/components/modals/modal";
import NameInputField from "../../../../shared/components/fields/unif";
import axios from "axios";

const CoordinatorCompany = () => {
  interface Company {
    id: any;
    index?: number;
    companyName: string;
    address: string;
    mentorName: string;
    contactNo: string;
    email: string;
  }
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [companyData, setCompanyData] = useState<Company[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    mentorName: "",
    contact: "",
    email: "",
  });
  const [coordinatorId, setCoordinatorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const storedCoordinatorId = localStorage.getItem("coordinator_id");
    if (storedCoordinatorId) {
      setCoordinatorId(storedCoordinatorId);
    } else {
      alert("Coordinator ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchCompanies = async () => {
    if (!coordinatorId) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/companiesni`, {
        params: { coordinator_id: coordinatorId },
      });
      const companies = response.data.map((company: any, index: number) => ({
        id: company.company_id,
        index: index + 1,
        companyName: company.company_name,
        address: company.company_address,
        mentorName: company.company_mentor,
        contactNo: company.company_contact,
        email: company.company_email,
      }));
      setCompanyData(companies);
    } catch (error) {
      console.error("Error fetching companies:", error);
      alert("Failed to fetch company data. Please try again.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [coordinatorId]);

  const handleEdit = (id: any) => {
    const companyToEdit = companyData.find((company) => company.id === id);
    if (companyToEdit) {
      setEditingCompany(companyToEdit);
      setFormData({
        companyName: companyToEdit.companyName,
        address: companyToEdit.address,
        mentorName: companyToEdit.mentorName,
        contact: companyToEdit.contactNo,
        email: companyToEdit.email,
      });
      setShowModal(true);
      setCurrentModal("details");
    }
  };

  const handleAddButtonClick = () => {
    setEditingCompany(null);
    setFormData({
      companyName: "",
      address: "",
      mentorName: "",
      contact: "",
      email: "",
    });
    setShowModal(true);
    setCurrentModal("details");
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    const value = e.target.value;
  
    if (field === "contact") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 11) {
        setFormData((prev) => ({ ...prev, [field]: numericValue }));
      }
    } else if (field === "email") {
      // Removed real-time validation here
      setFormData((prev) => ({ ...prev, [field]: value }));
    } else {
      const regex = /^[a-zA-Z\s,.'-]*$/;
      if (regex.test(value)) {
        setFormData((prev) => ({ ...prev, [field]: value }));
      } else {
        setErrorMessage(
          "Only letters, spaces, commas (,) and periods (.) are allowed."
        );
        setIsErrorModalOpen(true);
      }
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setCurrentModal(null);
  };

  const handleModalSave = async () => {
    if (!coordinatorId) {
      alert("Coordinator ID not found. Please log in again.");
      return;
    }
  
    // Validation checks
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      setIsErrorModalOpen(true);
      return;
    }
  
    if (formData.contact.length !== 11) {
      setErrorMessage("Contact number must contain exactly 11 digits.");
      setIsErrorModalOpen(true);
      return;
    }
  
    // Close modal immediately
    setShowModal(false);
    setCurrentModal(null);
  
    try {
      if (editingCompany) {
        await axios.put(`${API_BASE_URL}/api/company/${editingCompany.id}`, {
          company_name: formData.companyName,
          company_address: formData.address,
          company_mentor: formData.mentorName,
          company_contact: formData.contact,
          company_email: formData.email,
        });
      } else {
        await axios.post(`${API_BASE_URL}/api/add-company`, {
          coordinator_id: coordinatorId,
          company_name: formData.companyName,
          company_address: formData.address,
          company_mentor: formData.mentorName,
          company_contact: formData.contact,
          company_email: formData.email,
        });
      }
  
      // Await the fetch to ensure data is updated
      await fetchCompanies();
  
      // Reset form data
      setFormData({
        companyName: "",
        address: "",
        mentorName: "",
        contact: "",
        email: "",
      });
    } catch (error) {
      console.error("Error saving company:", error);
      setErrorMessage("Failed to save company. Please try again.");
      setIsErrorModalOpen(true);
    }
  };
  

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredCompanyData = companyData.filter((company) => {
    return (
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.mentorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.contactNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const columns = [
    { header: "#", key: "index", render: (row: any) => row.index },
    {
      header: "Company Name",
      key: "companyName",
      render: (row: any) => row.companyName || "N/A",
    },
    {
      header: "Address",
      key: "address",
      render: (row: any) => row.address || "N/A",
    },
    {
      header: "Mentor Name",
      key: "mentorName",
      render: (row: any) => row.mentorName || "N/A",
    },
    {
      header: "Contact #",
      key: "contactNo",
      render: (row: any) => row.contactNo || "N/A",
    },
    {
      header: "Email",
      key: "email",
      render: (row: any) => row.email || "N/A",
    },
    {
      header: "Action",
      key: "action",
      render: (row: any) => (
        <FontAwesomeIcon
          icon={faEdit}
          className="edit-icon"
          onClick={() => handleEdit(row.id)}
        />
      ),
    },
  ];

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Company</h1>
      <h2 className="page-subtitle">Manage Company Information</h2>
      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar placeholder="Search" onSearch={handleSearch} />
        </div>
        <div className="add-button-container">
          <PrimaryButton
            buttonText="Add Company"
            handleButtonClick={handleAddButtonClick}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </div>
      </div>
      <DataTable columns={columns} data={filteredCompanyData} />

      <Modal
        show={showModal && currentModal === "details"}
        title=""
        message=""
        onCancel={handleModalCancel}
        onConfirm={handleModalSave}
        size="large3"
        cancelButtonText="Cancel"
        confirmButtonText={editingCompany ? "Update" : "Save"}
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header-company">
            <div className="header-left">
              <h2 className="main-header">
                {editingCompany ? "Edit Company" : "Register New Company"}
              </h2>
              <h3 className="sub-header">Company Details</h3>
            </div>
          </div>
          <div className="scrollable-content">
            <div className="modal-single-column">
              <h4>Company Info</h4>
              <div className="form-field">
                <label htmlFor="companyName">Name</label>
                <NameInputField
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange(e, "companyName")}
                />
                <FontAwesomeIcon icon={faBuilding} className="icon" />
              </div>
              <div className="form-field">
                <label htmlFor="address">Address</label>
                <NameInputField
                  type="text"
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange(e, "address")}
                />
                <FontAwesomeIcon icon={faMapLocation} className="icon" />
              </div>

              <h4>Supervisor Info</h4>
              <div className="form-field">
                <label htmlFor="mentorName">Name</label>
                <NameInputField
                  type="text"
                  id="mentorName"
                  value={formData.mentorName}
                  onChange={(e) => handleInputChange(e, "mentorName")}
                />
                <FontAwesomeIcon icon={faUser} className="icon" />
              </div>
              <div className="form-field">
                <label htmlFor="contact">Contact Number</label>
                <NameInputField
                  type="text"
                  id="contact"
                  value={formData.contact}
                  onChange={(e) => handleInputChange(e, "contact")}
                />
                <FontAwesomeIcon icon={faPhone} className="icon" />
              </div>
              <div className="form-field">
                <label htmlFor="email">Email</label>
                <NameInputField
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                />
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        show={isErrorModalOpen}
        title="Error"
        message={errorMessage}
        onCancel={() => setIsErrorModalOpen(false)}
        size="small"
        singleButton={true}
      >
        <div className="modal-custom-content">
          <div className="modal-custom-header">
            <div className="header-left">
              <h2 className="main-header">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="error-icon"
                />
                Error
              </h2>
              <h3 className="sub-header">{errorMessage}</h3>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CoordinatorCompany;