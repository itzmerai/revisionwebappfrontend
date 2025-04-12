import React, { useState, useEffect, useMemo, useRef } from "react";
import { faPlus, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrimaryButton from "../../../../shared/components/buttons/primero-button";
import SearchBar from "../../../../shared/components/searchbar/searchbar";
import Modal from "../../../../shared/components/modals/modal";
import MultiSelectDropdown from "../../../../shared/components/dropdowns/multi-select-dropdown";
import NameInputField from "../../../../shared/components/fields/unif";
import "./com-task.scss";
import TaskCard from "../../../../shared/components/cards/taskcard";

interface Student {
  student_id: string;
  student_name: string;
}

interface Task {
  task_id: string;
  title: string;
  content: string;
  datePosted: string;
  assignedTo: string[];
  assignedStudentIds: string[];
  ratings?: { [student: string]: number };
}

const CompanyTask: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [, setCurrentTaskId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [rating, setRating] = useState("");
  const [currentStudents, setCurrentStudents] = useState<string[]>([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [newTask, setNewTask] = useState({
    title: "",
    content: "",
    type: "",
    assignedTo: [] as string[],
  });
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const tasksContainerRef = useRef<HTMLDivElement>(null);

  const filteredTasks = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return tasks.filter((task) => {
      return (
        task.title.toLowerCase().includes(lowerQuery) ||
        task.content.toLowerCase().includes(lowerQuery) ||
        task.assignedTo.some((student) =>
          student.toLowerCase().includes(lowerQuery)
        ) ||
        task.datePosted.toLowerCase().includes(lowerQuery)
      );
    });
  }, [tasks, searchQuery]);

  useEffect(() => {
    const storedCompanyId = localStorage.getItem("company_id");
    if (storedCompanyId) {
      setCompanyId(storedCompanyId);
    } else {
      alert("Company ID not found. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

useEffect(() => {
  if (companyId) {
    const fetchData = async () => {
      await fetchStudents();
      await fetchTasks();
    };
    fetchData();
  }
}, [companyId]);

  const fetchStudents = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/students?company_id=${companyId}`
      );
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks?company_id=${companyId}`
      );
      const data = await response.json();
      
      setTasks(
        data.map((task: any) => ({
          task_id: task.task_id,
          title: task.task_title,
          content: task.task_description,
          datePosted: new Date(task.task_created).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          assignedTo: task.assigned_students,
          // Remove .split() since it's already an array
          assignedStudentIds: task.assigned_student_ids 
            ? task.assigned_student_ids.map((id: string) => parseInt(id, 10)) 
            : []
        }))
      );
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleAddTaskClick = () => {
    setIsEditing(false);
    setCurrentTaskId(null);
    setNewTask({ title: "", content: "", type: "", assignedTo: [] });
    setShowModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setNewTask({ title: "", content: "", type: "", assignedTo: [] });
  };

  const handleModalSave = async () => {
    try {
      let url;
      let method;
      const body = {
        company_id: companyId,
        task_title: newTask.type,
        task_description: newTask.content,
        assigned_students: newTask.assignedTo, // Array of student IDs
      };

      if (isEditing && selectedTask) {
        url = `${API_BASE_URL}/api/tasks/${selectedTask.task_id}`;
        method = "PUT";
      } else {
        url = `${API_BASE_URL}/api/tasks`;
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchTasks();
        setShowModal(false);
        setNewTask({ title: "", content: "", type: "", assignedTo: [] });
      } else {
        console.error("Failed to save task");
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setNewTask({ ...newTask, [field]: e.target.value });
  };

  const handleEditTask = (task: Task) => {
    setIsEditing(true);
    setSelectedTask(task);
    setNewTask({
      title: task.title,
      content: task.content,
      type: task.title,
      assignedTo: task.assignedStudentIds, // Now an array of numbers
    });
    setShowModal(true);
  };

  useEffect(() => {
    const fetchCurrentRating = async () => {
      if (!selectedTask || !selectedStudent) return;
      
      const student = students.find(s => s.student_name === selectedStudent);
      if (!student) return;

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/tasks/${selectedTask.task_id}/rate/${student.student_id}`
        );
        const data = await response.json();
        setRating(data.rating?.toString() || "");
      } catch (error) {
        console.error("Error fetching rating:", error);
      }
    };

    if (showRatingModal) {
      fetchCurrentRating();
    }
  }, [showRatingModal, selectedStudent, selectedTask, students]);

  const handleRatingSubmit = async () => {
    if (!selectedTask || !selectedStudent) return;

    const student = students.find(s => s.student_name === selectedStudent);
    if (!student) {
      alert("Student not found");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/tasks/${selectedTask.task_id}/rate`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: student.student_id,
            rating: Number(rating),
          }),
        }
      );

      if (response.ok) {
        setShowRatingModal(false);
        setSelectedTask(null);
        setRating("");
      } else {
        console.error("Failed to update rating");
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  };

  return (
    <div className="dashboard-page">
      <h1 className="page-title">Task</h1>
      <h2 className="page-subtitle">Manage Tasks</h2>

      <div className="controls-container">
        <div className="search-bar-container">
          <SearchBar
            placeholder="Search tasks..."
            onSearch={(query) => setSearchQuery(query)}
          />
        </div>
        <div className="add-button-container">
          <PrimaryButton
            buttonText="Add Task"
            handleButtonClick={handleAddTaskClick}
            icon={<FontAwesomeIcon icon={faPlus} />}
          />
        </div>
      </div>

      <div className="task-container">
        <div className="task-cards-wrapper" ref={tasksContainerRef}>
          <div className="task-cards-container">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.task_id}
                taskType={task.title}
                assignedStudent={task.assignedTo}
                taskDescription={task.content}
                datePosted={task.datePosted}
                onEdit={() => handleEditTask(task)}
                onClick={() => setSelectedTask(task)}
              />
            ))}
          </div>
        </div>
      </div>

      {selectedTask && (
        <Modal
          show={!!selectedTask}
          message=""
          title="Task Details"
          onCancel={() => setSelectedTask(null)}
          onConfirm={() => {
            setCurrentStudents(selectedTask.assignedTo);
            setSelectedStudent(selectedTask.assignedTo[0] || "");
            setShowRatingModal(true);
          }}
          size="large2"
          cancelButtonText="Close"
          confirmButtonText={
            <>
              <FontAwesomeIcon icon={faStar} style={{ marginRight: "8px" }} />
              Rate
            </>
          }
          hideConfirm={false}
        >
          <div className="task-modal-content">
            <div className="modal-row">
              <div className="modal-label">Task:</div>
              <div className="modal-value">{selectedTask.title}</div>
            </div>
            <div className="modal-row">
              <div className="modal-label">Assigned To:</div>
              <div className="modal-value">
                {selectedTask.assignedTo.join(", ")}
              </div>
            </div>
            <div className="modal-row">
              <div className="modal-label">Date Posted:</div>
              <div className="modal-value">{selectedTask.datePosted}</div>
            </div>
            <div className="modal-row full-width">
              <div className="modal-label">Description:</div>
              <div className="modal-value">{selectedTask.content}</div>
            </div>
          </div>
        </Modal>
      )}

      {showRatingModal && (
        <Modal
          show={showRatingModal}
          message=""
          title="Rate Assigned Task"
          onCancel={() => setShowRatingModal(false)}
          onConfirm={handleRatingSubmit}
          size="smallmed"
          cancelButtonText="Cancel"
          confirmButtonText="Submit Rating"
        >
          <div className="rating-modal-content">
            <h3 className="sub-header">Assigned Student</h3>
            <div className="form-group">
              <select
                className="student-dropdown"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
              >
                {currentStudents.map((student) => (
                  <option key={student} value={student}>
                    {student}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grouprating">
              <label htmlFor="rating">Rating (Percentage)</label>
              <input
                type="number"
                id="rating"
                min="0"
                max="100"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                placeholder="Enter rating percentage"
              />
            </div>
          </div>
        </Modal>
      )}

      <Modal
        show={showModal}
        message=""
        title={isEditing ? "Edit Task" : "Create New Task"}
        onCancel={handleModalCancel}
        onConfirm={handleModalSave}
        size="large1"
        cancelButtonText="Cancel"
        confirmButtonText={isEditing ? "Update" : "Add"}
      >
        <div className="modal-custom-header-task">
          <div className="header-left">
            <h2 className="main-header">
              {isEditing ? "Edit Task" : "Create New Task"}
            </h2>
            <h3 className="sub-header">Task Details</h3>
          </div>
        </div>

        <div className="modalbody-task">
          <div className="modal-task-form">
            <div className="horizontal-fields">
              <div className="form-groups">
                <div className="form-group">
                  <label htmlFor="type">Task</label>
                  <NameInputField
                    type="text"
                    id="type"
                    className="name-input-field"
                    value={newTask.type}
                    onChange={(e) => handleInputChange(e, "type")}
                  />
                </div>
                <div className="form-groupp">
                  <label htmlFor="assignedto">Assigned to</label>
                  <MultiSelectDropdown
                      options={students.map((student) => student.student_name)}
                      value={students
                        .filter((s) => newTask.assignedTo.includes(s.student_id))
                        .map((s) => s.student_name)}
                      onChange={(value: string[]) =>
                        setNewTask({
                          ...newTask,
                          assignedTo: students
                            .filter((s) => value.includes(s.student_name))
                            .map((s) => s.student_id),
                        })
                      }
                      placeholder="Select students..."
                    />
                </div>
              </div>
              <div className="form-groupsss">
                <label htmlFor="description">Task Description</label>
                <NameInputField
                  type="textarea"
                  id="content"
                  className="name-input-field"
                  value={newTask.content}
                  onChange={(e) => handleInputChange(e, "content")}
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyTask;