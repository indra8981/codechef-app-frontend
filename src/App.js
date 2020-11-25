import React from "react";
import "./App.css";
import 'antd/dist/antd.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import HomePage from "./components/homepage.js";
import SignUp from "./components/signup.js";
import Problems from "./components/problems.js";
import LogIn from "./components/login.js";

// "proxy": "https://codechef-practice-backend.herokuapp.com",
import withAuth from "./components/withAuth.js";
function App() {
  return (
    <Router>
      <div className="container">
        <Route path="/" exact component={withAuth(HomePage)} />
        <Route path="/problems" exact component={withAuth(Problems)} />
        <Route path="/register" component={SignUp} />
        <Route path="/login" component={LogIn} />
      </div>
    </Router>
  );
}

export default App;