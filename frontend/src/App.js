import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import Homepage from "./components/homepage";
import Login from "./components/Login";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Homepage />} />

          {/* <Login /> */}
          {/* </Route> */}
        </Routes>
      </Router>
    </div>
  );
}

export default App;