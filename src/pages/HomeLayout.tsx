import { Outlet } from "react-router-dom";
import { Navbar } from "../Components";

const HomeLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
export default HomeLayout;
