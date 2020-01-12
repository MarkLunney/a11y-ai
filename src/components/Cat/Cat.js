import React from "react";
import "./Cat.css";

/**
 * 🐱
 */
const Cat = ({ src, altTag }) => (
  <div className="Cat">
    <img src={src} className="Cat-image" alt={altTag} />
    <p>
      <code>
        &lt;img src="cat.png"
        {typeof altTag === "string" && <> alt="{altTag}"</>} /&gt;
      </code>
    </p>
  </div>
);

export default Cat;
