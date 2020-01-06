import React, { useState } from "react";
import Cat from "./components/Cat";
import Button from "@material-ui/core/Button";
import "./App.css";

const App = () => {
  const [altTag, generateAltTag] = useState(0);

  const width = Math.ceil(Math.random() * 200) + 400;

  return (
    <main role="main" className="App">
      <h1>Random Cat Generator</h1>

      <Cat width={width} altTag={altTag} />

      <Button
        variant="contained"
        onClick={() => generateAltTag("cat")}
        color="primary"
      >
        Auto-generate alt tag
      </Button>
    </main>
  );
};

export default App;
