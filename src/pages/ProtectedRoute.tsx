import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useUser from "../utils/useUser";
import { Backdrop, CircularProgress } from "@mui/material";
type Props = {
  children: JSX.Element;
};

const ProtectedRoute = ({ children }: Props) => {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading)
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );

  if (isAuthenticated) return children;
};
export default ProtectedRoute;
