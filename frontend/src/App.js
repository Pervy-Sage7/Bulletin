import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Homepage from "./pages/homepage";
import Login from "./pages/Login";
import { useEffect, useState } from "react";
import UserPage from "./pages/userPage";

function App() {
  // const [access, setAccess] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    const access = localStorage.getItem("access");
    if (access) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);
  useEffect(() => {
    console.log("authentication: ", isAuthenticated);
  }, [isAuthenticated]);

  return (
    <div className="App">
      <Router>
        <Routes>
          {/* <Route
            exact
            path="/"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          /> */}
          <Route
            exact
            path="/"
            // element={<Homepage />}
            element={isAuthenticated ? <Homepage /> : <Login/>}
          />
          <Route
            exact
            path="/user/:username"
            // element={<UserPage />}
            element={isAuthenticated ? <UserPage /> : <Navigate to="/" />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
