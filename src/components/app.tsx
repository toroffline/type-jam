import { h } from "preact";
import { Router } from "preact-router";

import Home from "../routes/home";
import Profile from "../routes/profile";
import Header from "./header";

const App = () => (
  <div id="app">
    <link rel="stylesheet" href="../node_modules/nes.css/css/nes.min.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
      rel="stylesheet"
    />
    <Header />
    <Home />
    {/* <Router>
      <Profile path="/profile/" user="me" />
       <Profile path="/profile/:user" />
    </Router>*/}
  </div>
);

export default App;
