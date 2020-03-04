import React, { useState, useMemo, useCallback, useEffect } from "react";
import Cat from "../Cat";

import endpoints from "../../constants/endpoints";
import headers from "../../constants/headers";
import operationStatus from "../../constants/operationStatus";
import assets from "../../constants/assets";
import recognitionResultToText from "../../utils/recognitionResultToText";
import imageAnalysisToTag from "../../utils/imageAnalysisToTag";
import logError from "../../utils/logError";

import "./App.css";

/**
 * App Container
 */
const App = () => {
  const [width, setWidth] = useState(null);
  const [catAltTag, setCatAltTag] = useState(undefined);
  const [buttonAriaLabel, setButtonAriaLabel] = useState(undefined);
  const [isCatLoading, setCatLoading] = useState(false);

  /**
   * Randomly generate 🐱
   */
  const generateCatWidth = useCallback(() => {
    // Reset the alt tag
    setCatAltTag(0);

    // Set loading to true
    setCatLoading(true);

    // Determines the width of 🐱, ensuring it is different to the current cat
    const newWidth = Math.ceil(Math.random() * 200) + 400;
    setWidth(newWidth === width ? newWidth + 1 : newWidth);
  }, [width, setCatAltTag, setWidth]);

  /**
   * Change the src of 🐱 whenever width changes
   */
  const src = useMemo(
    () => (width ? `https://placekitten.com/${width}/300` : null),
    [width]
  );

  /**
   * Auto-generate altTag based on image analysis whenever src changes
   */
  useEffect(() => {
    if (src) {
      fetch(endpoints.analyzeImage, {
        method: "POST",
        headers,
        body: JSON.stringify({ url: src })
      })
        .then(response => response.json())
        .then(json => {
          console.log("Received Image Analysis: ", json);

          setCatAltTag(imageAnalysisToTag(json.description, json.objects));
          // setCatAltTag(imageAnalysisToTag(null, json.objects));

          setCatLoading(false);
        })
        .catch(e => {
          setCatLoading(false);
          logError(e);
        });
    }
  }, [src, setCatAltTag, setCatLoading]);

  /**
   * Gets the result of a Recognize Text Operation
   * @param {string} operationLocation The location to fetch
   * @param {number} operationCount The max tries for the operation
   */
  const getOperationResult = useCallback(
    (operationLocation, operationCount = 3) => {
      // Wait 1 second before getting the result (actual time depends on length of string)
      setTimeout(() => {
        fetch(operationLocation, {
          method: "GET",
          headers
        })
          .then(response => response.json())
          .then(json => {
            console.log("Recognized Text: ", json);

            if (json.status === operationStatus.SUCCEEDED) {
              setButtonAriaLabel(
                recognitionResultToText(json.recognitionResult)
              );
            } else if (
              json.status === operationStatus.NOT_STARTED ||
              json.status === operationStatus.RUNNING
            ) {
              // Recognition still running - fetch again after 1 second
              if (operationCount > 0) {
                getOperationResult(operationLocation, operationCount - 1);
              } else {
                throw new Error(
                  "Operation not completed within max tries - consider increasing timeout"
                );
              }
            } else {
              throw new Error("Error from Recognize Text Operation");
            }
          });
      }, 1000);
    },
    [setButtonAriaLabel]
  );

  /**
   * Starts the Recognize Text Operation on mount
   */
  useEffect(() => {
    fetch(endpoints.recognizeText, {
      method: "POST",
      headers,
      body: JSON.stringify({
        url: process.env.REACT_APP_HOST + assets.FETCH_BUTTON
      })
    })
      .then(response => {
        console.log("Recognize Text Response Status: " + response.status);

        if (response.status !== 202) {
          throw new Error(
            "API did not return a 202 response - cannot determine Operation Location"
          );
        }

        const operationLocation = response.headers.get("Operation-Location");

        getOperationResult(operationLocation);
      })
      .catch(logError);
  }, [getOperationResult]);

  return (
    <main role="main" className="App">
      <h1>
        <img src="header.png" alt="Random Cat Generator" />
      </h1>

      {/* Image of 🐱 */}
      {src && !isCatLoading && <Cat src={src} altTag={catAltTag} />}

      {/* Loading text */}
      {isCatLoading && <span>Waiting for the next cat...</span>}

      {/* Button to fetch a new 🐱 */}
      {!isCatLoading && (
        <button
          className="fetchButton"
          onClick={generateCatWidth}
          style={{ backgroundImage: `url(${assets.FETCH_BUTTON})` }}
          aria-label={buttonAriaLabel}
        ></button>
      )}
    </main>
  );
};

export default App;
