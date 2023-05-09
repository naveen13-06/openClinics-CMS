import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Write from "./pages/Write";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import QueWrite from "./pages/QueWrite";
import "./style.scss"
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/authContext";
import QueDisplay from "./pages/QueDisplay";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
const Permission  = () => {
  const { currentUser } = useContext(AuthContext);
  return currentUser ? <Navigate to="/" replace />: <Login/>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/post/:domain/:type/:id",
        element: <Single />,
      },
      {
        path: "/write",
        element: <Write />,
      },
      {
        path: "/questions/write",
        element: <QueWrite />,
      },
      {
        path: "/questions",
        element: <Home />,
      },
      {
        path: "/questions/:subject/:lesson/:id",
        element: <QueDisplay />,
      }
    ],
  },
  {
    path: "/login",
    element:<Permission />
  },

]);

function App() {
  
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
