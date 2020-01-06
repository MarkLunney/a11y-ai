import React from "react";
import "./Cat.css";

const Cat = ({ altTag }) => (
  <div className="Cat">
    <img
      src="https://placekitten.com/400/300"
      className="Cat-image"
      alt={altTag}
    />
    <p>
      <pre>
        <code>
          &lt;img src="cat.png"
          {altTag !== null && altTag !== undefined && <> alt="{altTag}"</>}{" "}
          /&gt;
        </code>
      </pre>
    </p>
  </div>
);

export default Cat;
