import React, { useState, useMemo, useCallback } from "react";
import Cat from "../Cat";
import Button from "@material-ui/core/Button";

import Amplify from "aws-amplify";
import awsconfig from "../../aws-exports";
import Predictions, {
  AmazonAIPredictionsProvider
} from "@aws-amplify/predictions";

import "./App.css";

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

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
  const [catAsBase64, setCatAsBase64] = useState("");

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
    // Convert image to buffer to send to API
    const buffer = new Buffer(catAsBase64, "base64");

    // Identify labels using Predictions API
    Predictions.identify({
      labels: {
        source: {
          bytes: buffer
        },
        format: "LABELS" // Available options "PLAIN", "FORM", "TABLE", "ALL"
      }
    })
      .then(({ labels }) => {
        const matches = labels.map(label => label.name);

        setAltTag(matches.join(", "));
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  }, [catAsBase64, setAltTag]);

  /**
   * Listen for the onLoad event on cats
   */
  const imageLoaded = useCallback(
    event => {
      // Convert the cat as a base64 string
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const img = event.target;

      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      ctx.drawImage(img, 0, 0);

      const uri = canvas.toDataURL("image/jpeg");

      setCatAsBase64(uri.replace("data:image/jpeg;base64,", ""));

      // Set loading to false
      setLoading(false);
    },
    [setCatAsBase64, setLoading]
  );

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
