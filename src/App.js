import React from "react";
import Cat from "./components/Cat";
import "./App.css";

const App = () => (
  <div className="App">
    <Cat altTag="" />

    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Auto-generate alt tag
    </a>
  </div>
);

export default App;
