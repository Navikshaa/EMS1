import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboad";
import EmployeeDashboard from "./pages/EmployeeDashboad";
import HrDashboard from "./pages/HrDashboard";
import SetNewPassword from "./pages/SetNewPassword";
import AdminResetPassword from "./pages/EmployeePassword";

import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";

// Dashboard components
import AdminSummary from "./components/dashboard/AdminSummary";
import HrSummary from "./components/HrDashboard/HrSummary";
import EmployeeSummary from "./pages/EmployeeNavDashboard";

// Admin Department
import DepartmentList from "./components/department/DepartmentList";
import AddDepartment from "./components/department/AddDepartment";
import DeleteDepartment from "./components/department/DeleteDepartment";

// Chat
import ChatLayout from "./pages/ChatLayout";
import ChatRoom from "./components/groupChat/ChatRoom";
import SettingChat from "./components/groupChat/Setting";
import HomePlaceholder from "./pages/HomePlaceholder";
import DirectChat from "./components/groupChat/DirectChat";
import NewChat from "./pages/NewChat";
import AddGroup from "./components/groupChat/AddGroup";
import MyGroups from "./components/groupChat/MyGroups";

// HR Department
import DepartmentList1 from "./components/HrDepartment/DepartmentList";
import AddDepartment1 from "./components/HrDepartment/AddDepartment";
import DeleteDepartment1 from "./components/HrDepartment/DeleteDepartement";

// Employee
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./pages/EmployeeProfile";
import Edit from "./components/employee/Edit";
import HrList from "./components/employee/HrList";

// Salary
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import ViewSalaryEmp from "./components/salary/ViewEmp";

// Team
import TeamList from "./components/team/TeamList";
import AddTeam from "./components/team/Add";
import ViewTeam from "./components/team/ViewTeam";
import EmTeam from "./components/team/EmTeam";
import EmView from "./components/team/EmView";

// PF
import PfView from "./components/pf/PfView";
import PfView1 from "./components/EmployeePf/PfView";

// Leave
import LeaveList from "./components/leave/list";
import LeaveAdd from "./components/leave/add";
import Leavetable from "./components/leave/Table";
import LeaveList1 from "./components/Hrleave/list";
import LeaveAdd1 from "./components/Hrleave/add";
import DetailLeave from "./components/leave/DetailLeave";

// Attendance
import View4 from "./components/attendance/View";
import View5 from "./pages/Attendanceem";
import AdminView from "./components/attendance/AdminView";
import AttendanceEditView from "./components/attendance/AdminEditView";

// Settings
import Setting from "./components/EmployeeDashboard/Setting";

//tasks
import DptTaskList from "./components/task/DptTaskList";
import RoleList from "./components/task/Rolelist";
import TaskList from "./components/task/Tasklist";
import EmDepartmentView from "./components/task/EmDepartmentView";
import EmTasklist from "./components/task/EmTaskList";
import VerifyCertificate from "./pages/verify/Verify";
import HrTask from "./components/task/TaskStatus/HrTasklist";
import Onboarding1 from "./components/task/TaskStatus/hrTaks/Onboarding";
import EmList from "./components/task/TaskStatus/hrTaks/EmList";
import AttendanceUserList from "./components/task/TaskStatus/hrTaks/hrAttendaceView";
import EmpAttendancePage from "./components/task/TaskStatus/hrTaks/EmpAttendancePage";
import EditEmployee from "./components/task/TaskStatus/hrTaks/EditEmployee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />

        {/* Admin Dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <AdminDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<AdminSummary />} />
          <Route path="departments" element={<DepartmentList />} />
          <Route path="add-department" element={<AddDepartment />} />
          <Route path="department/:id" element={<AddDepartment />} />
          <Route path="delete-department/:id" element={<DeleteDepartment />} />

          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="employees/salary/:id" element={<ViewSalary />} />

          <Route path="teams" element={<TeamList />} />
          <Route path="add-team" element={<AddTeam />} />
          <Route path="teams/team/:id" element={<ViewTeam />} />

          <Route path="salary/add" element={<AddSalary />} />

          <Route path="settings" element={<Setting />} />
          <Route path="adminResetPassword" element={<AdminResetPassword />} />
          <Route path="leaves" element={<Leavetable />} />
          <Route path="leaves/:id" element={<DetailLeave />} />
          <Route path="employees/leaves/:id" element={<LeaveList />} />

          <Route path="attendance" element={<AdminView />} />
          <Route
            path="attendance/view/:userId"
            element={<AttendanceEditView />}
          />

          <Route path="tasks" element={<DptTaskList />} />
          <Route path="tasks/department/:id" element={<RoleList />} />
          <Route path="tasks/subDepartment/:id" element={<TaskList />} />

          {/* ✅ Group & Direct Chat under "groups" route */}
          <Route path="groups" element={<ChatLayout />}>
            <Route index element={<HomePlaceholder />} />
            <Route path="setting" element={<SettingChat />} />
            <Route path="addgroup" element={<AddGroup />} />
            <Route path="new-chat" element={<NewChat />} />
            <Route path="direct/:id" element={<DirectChat />} />
            <Route path=":id" element={<ChatRoom />} />
          </Route>

          {/* ✅ Optional: allow direct chat at /admin-dashboard/direct/:id */}
        </Route>

        {/* HR Dashboard */}
        <Route
          path="/hr-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["hr"]}>
                <HrDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<HrSummary />} />
          <Route path="departments" element={<DepartmentList1 />} />
          <Route path="add-department" element={<AddDepartment1 />} />
          <Route path="department/:id" element={<AddDepartment1 />} />
          <Route path="delete-department/:id" element={<DeleteDepartment1 />} />

          <Route path="employees" element={<List />} />
          <Route path="add-employee" element={<Add />} />
          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<Edit />} />
          <Route path="hr-employees" element={<HrList />} />

          <Route path="pf/:employeeId" element={<PfView />} />
          <Route path="leaves" element={<LeaveList1 />} />
          <Route path="add-leave" element={<LeaveAdd1 />} />
          <Route path="login-history/:employeeId" element={<View4 />} />
        </Route>

        {/* Employee Dashboard */}
        <Route
          path="/employee-dashboard"
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <EmployeeDashboard />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route index element={<EmployeeSummary />} />
          <Route path="profile/:id" element={<View />} />
          <Route path="add-leave/:id" element={<LeaveAdd />} />
          <Route path="salary/:id" element={<ViewSalaryEmp />} />
          <Route path="pf/:employeeId" element={<PfView1 />} />
          <Route path="login-history/:id" element={<View5 />} />
          <Route path="teams/user/:UserId" element={<EmTeam />} />
          <Route path="teams/team/:id" element={<EmView />} />

          <Route path="task/user/:userId" element={<EmDepartmentView />} />
          <Route path="tasks/department/:id" element={<EmTasklist />} />
          <Route path="tasks/hr/task" element={<HrTask />} />
          <Route path="tasks/hr/task/Onboarding" element={<Onboarding1 />} />

          <Route path="task/employees" element={<EmList />} />
          <Route path="hr/attendance" element={<AttendanceUserList />} />
          <Route path="hr/attendance/:userId" element={<EmpAttendancePage />} />
          <Route
            path="attendance/view/:userId"
            element={<AttendanceEditView />}
          />
          <Route path="leaves" element={<Leavetable />} />
          <Route path="leaves/:id" element={<DetailLeave />} />

          <Route path="employees/:id" element={<View />} />
          <Route path="employees/edit/:id" element={<EditEmployee />} />

          <Route path="groups" element={<ChatLayout />}>
            <Route index element={<HomePlaceholder />} />
            <Route path="setting" element={<SettingChat />} />
            <Route path="addgroup" element={<AddGroup />} />
            <Route path="new-chat" element={<NewChat />} />
            <Route path=":id" element={<ChatRoom />} /> {/* ✅ FIXED */}
            <Route path="direct/:id" element={<DirectChat />} />
          </Route>
        </Route>
        <Route path="verify/:id" element={<VerifyCertificate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
