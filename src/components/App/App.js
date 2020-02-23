import React, { useState, useMemo, useCallback, useEffect } from "react";
import Cat from "../Cat";

import responseToTag from "../../utils/responseToTag";
import endpoints from "../../constants/endpoints";
import headers from "../../constants/headers";
import "./App.css";

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
      fetch(endpoints.analyze, {
        method: "POST",
        headers,
        body: JSON.stringify({ url: src })
      })
        .then(response => response.json())
        .then(json => {
          console.log("Received: ", json);

          setCatAltTag(responseToTag(json.description, json.objects));
          // setCatAltTag(responseToTag(null, json.objects));

          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.error(JSON.stringify(err, null, 2));
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
