import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginForm from "../../../shared/login/login";
import Dashboard from "../../domain/admin/dashboard/admin-dashboard";
import Overview from "../../domain/admin/dashboard/admin-overview";
import Coordinator from "../../domain/admin/user-management/user-coordinator";
import Student from "../../domain/admin/user-management/user-student";
import Program from "../../domain/admin/program/admin-program";
import CDashboard from "../../domain/coordinator/dashboard/coordinator-1dashb";
import CoordinatorDashboard from "../../domain/coordinator/dashboard/coordinator-dashboard";
import Attendance from "../../domain/coordinator/attendance/cd-attendance";
import CoordinatorStudent from "../../domain/coordinator/students/cd-student";
import CoordinatorCompany from "../../domain/coordinator/company/cd-company";
import CoordinatorReport from "../../domain/coordinator/report/cd-report";
import CoordinatorAnnouncement from "../../domain/coordinator/announcement/cd-announcement";
import StudentDocuments from "../../../shared/components/buttons/report/StudentDocuments";
import CompanyDashboard from "../../domain/company/dashboard/company-dashboard";
import CompanyAttendance from "../../domain/company/attendance/company-attendance";
import CompanyReport from "../../domain/company/report/com-report";
import ComDashboard from "../../domain/company/dashboard/company-1dashb";
import CompanyTask from "../../domain/company/task/com-task";
import ComStudent from "../../domain/company/student/com-student";
import CompanyInternProgress from "../../domain/company/internprogress/com-progress";
import CoordinatorInternProgress from "../../domain/coordinator/internprogress/cd-progress";
import Profile from "../../domain/company/profile/profile";
import StudentTaskDocuments from "../../domain/company/report/company-report/StudentDocuments";
export function AppRoute() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LoginForm />,
    },
    {
      path: "/student-documents/:studentId",
      element: <StudentDocuments />,
    },
    {
      path: "/student-taskdocuments/:studentId",
      element: <StudentTaskDocuments />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        {
          path: "overview",
          element: <Overview />,
        },
        {
          path: "coordinator",
          element: <Coordinator />,
        },
        {
          path: "students",
          element: <Student />,
        },
        {
          path: "program",
          element: <Program />,
        },
      ],
    },
    {
      path: "/cddashboard",
      element: <CDashboard />,
      children: [
        {
          path: "coordinator-dashboard",
          element: <CoordinatorDashboard />,
        },
        {
          path: "attendance",
          element: <Attendance />,
        },
        {
          path: "coordinator-students",
          element: <CoordinatorStudent />,
        },
        {
          path: "company",
          element: <CoordinatorCompany />,
        },
        {
          path: "report",
          element: <CoordinatorReport />,
        },
        {
          path: "announcement",
          element: <CoordinatorAnnouncement />,
        },
        {
          path: "cd-progress",
          element: <CoordinatorInternProgress />,
        },
      ],
    },

    {
      path: "/comdashboard",
      element: <ComDashboard />,
      children: [
        {
          path: "company-dashboard",
          element: <CompanyDashboard />,
        },
        {
          path: "company-attendance",
          element: <CompanyAttendance />,
        },
        {
          path: "company-student",
          element: <ComStudent />,
        },
        {
          path: "report",
          element: <CompanyReport />,
        },
        {
          path: "task-upload",
          element: <CompanyTask />,
        },
        {
          path: "intern-progress",
          element: <CompanyInternProgress />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}
