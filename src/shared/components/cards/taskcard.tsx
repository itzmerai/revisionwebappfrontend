// taskcard.tsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "./taskcard.scss";

interface TaskCardProps {
  taskType: string;
  assignedStudent: string[];
  taskDescription: string;
  datePosted: string;
  onEdit: () => void;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  taskType,
  assignedStudent,
  taskDescription,
  datePosted,
  onEdit,
  onClick,
}) => {
  const [showEditIcon, setShowEditIcon] = useState(false);

  const truncatedDescription =
    taskDescription.length > 200
      ? `${taskDescription.substring(0, 200)}...`
      : taskDescription;

  // Format assigned students for display
  const displayAssignedStudents = () => {
    if (assignedStudent.length === 0) return "Unassigned";
    if (assignedStudent.length <= 2) {
      return assignedStudent.join(", ");
    }
    return `${assignedStudent.slice(0, 2).join(", ")} +${
      assignedStudent.length - 2
    }`;
  };

  // Format date and time separately
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date
      .toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      })
      .toLowerCase();
  };

  return (
    <div
      className="task-card"
      onMouseEnter={() => setShowEditIcon(true)}
      onMouseLeave={() => setShowEditIcon(false)}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${taskType}. Assigned to: ${assignedStudent.join(
        ", "
      )}. Description: ${truncatedDescription}`}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {showEditIcon && (
        <button
          className="edit-icon"
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          aria-label="Edit task"
        >
          <FontAwesomeIcon icon={faEdit} />
        </button>
      )}
      <div className="task-type">{taskType}</div>
      <div className="assigned-student" title={assignedStudent.join(", ")}>
        {displayAssignedStudents()}
      </div>
      <div
        className="task-description"
        aria-label={taskDescription}
        title={taskDescription}
      >
        {truncatedDescription}
        <div className="task-date">
          {formatDate(datePosted)} |{" "}
          <span className="task-time">{formatTime(datePosted)}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
