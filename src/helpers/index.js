export const isStringifiedJSON = text => {
  if (typeof text !== "string") {
    return false;
  }
  try {
    return JSON.parse(text) instanceof Object;
  } catch (error) {
    return false;
  }
};
