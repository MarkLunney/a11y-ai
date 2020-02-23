const subscriptionKey = process.env.REACT_APP_KEY;

/**
 * The headers to POST to the Cognitive Services API
 * @property {string} "Content-Type"
 * @property {string} "Ocp-Apim-Subscription-Key"
 */
const headers = {
  "Content-Type": "application/json",
  "Ocp-Apim-Subscription-Key": subscriptionKey
};

export default headers;
