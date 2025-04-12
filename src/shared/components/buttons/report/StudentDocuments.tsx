import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StudentDocuments: React.FC = () => {
  const { studentId } = useParams();
  const [documents, setDocuments] = useState<any[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/student-documents`,
          { params: { studentId } }
        );
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
        alert("Error loading documents");
      } finally {
        setLoading(false);
      }
    };

    if (studentId) fetchDocuments();
  }, [studentId]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div style={{ padding: '1rem', fontSize: '1.2rem' }}>Loading...</div>;

  return (
    <div style={{ padding: '1rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
        Student Documents
      </h1>
      
      {documents.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No documents found for this student.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem',
          width: '100%',
          justifyItems: 'center'
        }}>
          {documents.map((doc) => (
            <div 
              key={doc.document_id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '300px',
                minWidth: '200px'
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => window.location.href = doc.uploaded_file}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'background-color 0.2s'
                  }}
                >
                  View Image
                </button>
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#666',
                textAlign: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '0.5rem'
              }}>
                <div>
                {doc.remarks || 'No remarks provided'}
                </div>
                Uploaded: {formatDate(doc.date_uploaded)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDocuments;