import React, { useState, useMemo, useCallback, useEffect } from "react";
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
 * App Container
 */
const App = () => {
  const [width, setWidth] = useState(null);
  const [altTag, setAltTag] = useState(0);
  const [isLoading, setLoading] = useState(false);

  /**
   * Randomly generate 🐱
   */
  const generateCatWidth = useCallback(() => {
    // Reset the alt tag
    setAltTag(0);

    // Set loading to true
    setLoading(true);

    // Determines the width of 🐱, ensuring it is different to the current cat
    const newWidth = Math.ceil(Math.random() * 200) + 400;
    setWidth(newWidth === width ? newWidth + 1 : newWidth);
  }, [width, setAltTag, setWidth]);

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
              setAltTag(matches.join(", "));

              setLoading(false);
            })
            .catch(err => console.log(JSON.stringify(err, null, 2)));
        });
    }
  }, [src, setAltTag, setLoading]);

  return (
    <main role="main" className="App">
      <h1>Random Cat Generator</h1>

      {/* 🐱 */}
      {src && !isLoading && <Cat src={src} altTag={altTag} />}

      {/* Loading text */}
      {isLoading && <span>Waiting for the next cat...</span>}

      {/* Action Buttons */}
      {!isLoading && (
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
      )}
    </main>
  );
};

export default App;
