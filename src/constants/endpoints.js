import visualFeatures from "./visualFeatures";
import textMode from "./textMode";

const endpoint = process.env.REACT_APP_ENDPOINT;

// Analyze Image Endpoint
const analyzeParams = new URLSearchParams({
  visualFeatures: [visualFeatures.DESCRIPTION, visualFeatures.OBJECTS].join(",")
});

const analyzeImage =
  endpoint + "vision/v2.0/analyze?" + analyzeParams.toString();

// Text Mode Endpoint
const textParams = new URLSearchParams({ mode: textMode.PRINTED });

const recognizeText =
  endpoint + "vision/v2.0/recognizeText?" + textParams.toString();

/**
 * Construct the Cognitive Services endpoints
 * @property {string} analyze
 */
const endpoints = {
  analyzeImage,
  recognizeText
};

export default endpoints;
