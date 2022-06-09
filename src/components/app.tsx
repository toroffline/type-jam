import { h } from "preact";
import { Router } from "preact-router";

import Home from "../routes/home";
import Profile from "../routes/profile";
import Header from "./header";

const App = () => (
  <div id="app">
    <Header />
    <Home />
    {/* <Router>
      <Profile path="/profile/" user="me" />
       <Profile path="/profile/:user" />
    </Router>*/}
  </div>
);

export default App;
