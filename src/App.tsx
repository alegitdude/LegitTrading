import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  HomeLayout,
  DashboardLayout,
  Error,
  Market,
  Charts,
  CompanyProfile,
  Account,
  WatchList,
  Login,
  ProtectedRoute,
  Landing,
  Signup,
} from "./pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error />,
    children: [
      {
        path: "market",
        element: <Market />,
      },
      {
        path: "company profile",
        element: <CompanyProfile />,
      },
      {
        path: "charts",
        element: <Charts />,
      },
      {
        path: "watchlist",
        element: <WatchList />,
      },
      {
        path: "account",
        element: <Account />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
