import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const StudentTaskDocuments: React.FC = () => {
  const { studentId } = useParams();
  const [documents, setDocuments] = useState<any[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/intern-documentation/student-task-documents`,
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
        Student Task Documents
      </h1>
      
      {documents.length === 0 ? (
        <p style={{ color: '#666', fontStyle: 'italic' }}>No task documents found for this student.</p>
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
              key={doc.uploaded_task_id}
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
              <h3 style={{ 
                fontSize: '1rem',
                fontWeight: '600',
                color: '#666',
                marginBottom: '0.5rem',
                textAlign: 'center'
              }}>
                {doc.task_title}
              </h3>
              <div style={{ marginBottom: '0.5rem' }}>
                <button
                  onClick={() => window.open(doc.uploaded_taskdocument, '_blank')}
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
                  View Document
                </button>
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#666',
                textAlign: 'center',
                borderTop: '1px solid #eee',
                paddingTop: '0.5rem'
              }}>
                <div style={{ marginBottom: '0.25rem' }}>
                  {doc.remarks || 'No remarks provided'}
                </div>
                <div>Uploaded: {formatDate(doc.uploaded_date)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentTaskDocuments;