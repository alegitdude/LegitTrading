import { Outlet } from "react-router-dom";
import { Navbar } from "../Components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUser from "../utils/useUser";
const HomeLayout = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated && !isLoading) navigate("/dashboard/market");
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};
export default HomeLayout;
