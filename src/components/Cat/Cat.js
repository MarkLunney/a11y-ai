import React from "react";
import "./Cat.css";

const Cat = ({ width, altTag }) => (
  <div className="Cat">
    <img
      src={`https://placekitten.com/${width}/300`}
      className="Cat-image"
      alt={altTag}
    />
    <p>
      <code>
        &lt;img src="cat.png"
        {typeof altTag === "string" && <> alt="{altTag}"</>} /&gt;
      </code>
    </p>
  </div>
);

export default Cat;
