import React, { useEffect, useState } from "react";
import "./App.css";
import Home from "./components/Home";
import GraphCity from "./components/GraphCity";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { AuthProvider } from "./components/Firebase";
import Logged from "./components/Logged";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PrivateRoute path="/logged/:city" component={GraphCity} />
          <PrivateRoute path="/logged" component={Logged} />
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
