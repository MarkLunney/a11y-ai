/**
 * Determines an alt tag from a Cognitive Services image analysis response
 * @param {{ captions: Object[] }} [description] The description from the response (visualFeatures=Description)
 * @param { objects: Object[] } [objects] The objects from the response (visualFeatures=Objects)
 * @returns {string} An alt tag, or empty string if one could not be determined
 */
const imageAnalysisToTag = (description, objects) => {
  const prefix = "Appears to be ";

  if (description && description.captions && description.captions.length) {
    return prefix + description.captions[0].text;
  }

  if (objects && objects.length) {
    return prefix + "a " + objects.map(o => o.object).join(" and a ");
  }

  return "";
};

export default imageAnalysisToTag;
