/**
 * Logs an error to the console
 * @param {Error} e An Error object
 */
const logError = e => {
  console.error(JSON.stringify(e, null, 2));
};

export default logError;
