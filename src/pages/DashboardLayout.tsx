import { Outlet } from "react-router-dom";
import { DashNav } from "../Components";

const DashboardLayout = () => {
  return <DashNav outlet={<Outlet />} />;
};
export default DashboardLayout;
