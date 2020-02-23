import visualFeatures from "./visualFeatures";

const endpoint = process.env.REACT_APP_ENDPOINT;

const searchParams = new URLSearchParams();

searchParams.set(
  "visualFeatures",
  [visualFeatures.DESCRIPTION, visualFeatures.OBJECTS].join(",")
);

/**
 * Construct the Cognitive Services endpoints
 * @property {string} analyze
 */
const endpoints = {
  analyze: endpoint + "vision/v2.0/analyze?" + searchParams.toString()
};

export default endpoints;
