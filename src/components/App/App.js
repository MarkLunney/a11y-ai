import React, { useState, useMemo, useCallback, useEffect } from "react";
import Cat from "../Cat";

import Amplify from "aws-amplify";
import awsconfig from "../../aws-exports";
import Predictions, {
  AmazonAIPredictionsProvider
} from "@aws-amplify/predictions";

import "./App.css";

Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());

/**
 * App Container
 */
const App = () => {
  const [width, setWidth] = useState(null);
  const [catAltTag, setCatAltTag] = useState(undefined);
  const [buttonAltTag, setButtonAltTag] = useState(undefined);
  const [isLoading, setLoading] = useState(false);

  /**
   * Randomly generate 🐱
   */
  const generateCatWidth = useCallback(() => {
    // Reset the alt tag
    setCatAltTag(0);

    // Set loading to true
    setLoading(true);

    // Determines the width of 🐱, ensuring it is different to the current cat
    const newWidth = Math.ceil(Math.random() * 200) + 400;
    setWidth(newWidth === width ? newWidth + 1 : newWidth);
  }, [width, setCatAltTag, setWidth]);

  /**
   * Support key down event on elements with button role
   */
  const onKeyDownCat = useCallback(
    event => {
      if (
        event.key === " " ||
        event.key === "Enter" ||
        event.key === "Spacebar"
      ) {
        generateCatWidth();
      }
    },
    [generateCatWidth]
  );

  /**
   * Change the src of 🐱 whenever width changes
   */
  const src = useMemo(
    () => (width ? `https://placekitten.com/${width}/300` : null),
    [width]
  );

  /**
   * Auto-generate altTag based on image data whenever src changes
   */
  useEffect(() => {
    if (src) {
      // Refetch src to get array buffer = browser cache will prevent multiple requests
      fetch(src)
        .then(res => res.arrayBuffer())
        .then(buffer => {
          // Identify labels using Predictions API
          Predictions.identify({
            labels: {
              source: {
                bytes: buffer // Set our buffer as the src. Also supports File and S3 Image Paths
              },
              format: "LABELS" // Available options "PLAIN", "FORM", "TABLE", "ALL"
            }
          })
            .then(({ labels }) => {
              const matches = labels.map(label => label.name);

              // Set the alt tag to a list of the matches
              setCatAltTag(matches.join(", "));

              setLoading(false);
            })
            .catch(err => console.log(JSON.stringify(err, null, 2)));
        });
    }
  }, [src, setCatAltTag, setLoading]);

  /**
   * Sets the alt tag of the button on mount
   */
  useEffect(() => {
    setButtonAltTag("Fetch a new cat");
  }, [setButtonAltTag]);

  return (
    <main role="main" className="App">
      <h1>
        <img src="header.png" alt="Random Cat Generator" />
      </h1>

      {/* Image of 🐱 */}
      {src && !isLoading && <Cat src={src} altTag={catAltTag} />}

      {/* Loading text */}
      {isLoading && <span>Waiting for the next cat...</span>}

      {/* Button to fetch a new 🐱 */}
      {!isLoading && (
        <img
          src="fetch-text.png"
          alt={buttonAltTag}
          className="fetchButton"
          tabIndex="0"
          onClick={generateCatWidth}
          onKeyDown={onKeyDownCat}
          role="button"
        />
      )}
    </main>
  );
};

export default App;
