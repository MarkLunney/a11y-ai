/**
 * Determines an text string from a Cognitive Services text recognition response
 * @param {{ lines: Object[] }} [recognitionResult] The recognitionResult from the response
 * @returns {string} An single concatted string of all results, or empty string if text could not be determined
 */
const recognitionResultToText = recognitionResult => {
  if (recognitionResult && recognitionResult.lines) {
    return recognitionResult.lines.map(line => line.text).join(" ");
  }

  return "";
};

export default recognitionResultToText;
