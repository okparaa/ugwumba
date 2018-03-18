export const processAPIData = function (data) {
  /*
  Converts the data formatted for IndexedDB / API into the format
  our application uses.
   */
  let res = {};
  Object.keys(data).forEach((key) => { res[data[key].id] = data[key]; });
  return res;
};

export const sortObjects = (objects, key, reverse = false) => {
  /*
  Sorts a list of objects based on the value of their key property
   */
  let sortedKeys = Object.keys(objects).sort((a, b) => {
    if (reverse) return objects[b][key] - objects[a][key];
    return parseInt(objects[a][key]) - parseInt(objects[b][key]);
  });
  let sortedObjects = {};
  sortedKeys.forEach(key => {
    sortedObjects[key] = objects[key];
  });
  return sortedObjects;
};

