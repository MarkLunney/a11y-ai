/* global process */

import React, { useState, useMemo, useCallback } from "react";
import Cat from "../Cat";
import Button from "@material-ui/core/Button";
import "./App.css";

console.log(process.env.REACT_APP_KEY);

/**
 * Generate a random int between 400 and 600
 */
const randomWidth = () => Math.ceil(Math.random() * 200) + 400;

/**
 * App Container
 */
const App = () => {
  const [width, setWidth] = useState(randomWidth());
  const [altTag, setAltTag] = useState(0);
  const [isLoading, setLoading] = useState(true);

  /**
   * Determines the width of the 🐱
   */
  const generateCatWidth = useCallback(() => {
    // Reset the alt tag
    setAltTag(0);

    // Set loading to true
    setLoading(true);

    // Determines the width of 🐱, ensuring it is different to the current cat
    const newWidth = randomWidth();
    setWidth(newWidth === width ? newWidth + 1 : newWidth);
  }, [width, setAltTag, setWidth]);

  /**
   * Change the src of 🐱 whenever width changes
   */
  const src = useMemo(() => `https://placekitten.com/${width}/300`, [width]);

  /**
   * Generate the alt tag for the given image
   */
  const generateAltTag = useCallback(() => {
    // TODO - Determine correct alt tag from src
    setAltTag("cat - " + src);
  }, [src, setAltTag]);

  /**
   * Listen for the onLoad event on cats
   */
  const imageLoaded = useCallback(() => {
    // Set loading to false
    setLoading(false);
  }, [setLoading]);

  return (
    <main role="main" className="App">
      <h1>Random Cat Generator</h1>

      {/* The Cat */}
      <Cat src={src} altTag={altTag} onImageLoaded={imageLoaded} />

      {/* Loading text */}
      {isLoading && <span>Waiting for the next cat...</span>}

      {/* Action Buttons */}
      {!isLoading && (
        <>
          <Button
            variant="contained"
            onClick={generateCatWidth}
            color="secondary"
            style={{
              marginBottom: "1rem"
            }}
          >
            Fetch a new cat
          </Button>

          <Button variant="contained" onClick={generateAltTag} color="primary">
            Auto-generate alt tag
          </Button>
        </>
      )}
    </main>
  );
};

export default App;
