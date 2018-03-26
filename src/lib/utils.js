export default {
  processAPIData(data) {
    let res = {};
    Object.keys(data).forEach((key) => { res[data[key].id] = data[key]; });
    return res;
  },
  sortObjects(objects, key, reverse = false){
    let sortedKeys = Object.keys(objects).sort((a, b) => {
      if (reverse) return objects[b][key] - objects[a][key];
      return parseInt(objects[a][key]) - parseInt(objects[b][key]);
    });
    let sortedObjects = {};
    sortedKeys.forEach(key => {
      sortedObjects[key] = objects[key];
    });
    return sortedObjects;
  },
  guid(){
    function s4 () {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  },
  hasClass(el, className){
    if (el.classList){
      return el.classList.contains(className);
    }else{ 
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  },
  removeClass(el, className){
    if (el.classList){
      el.classList.remove(className);
    }else{
      el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },
  toggle(el, className){
    if(el.classList) {
      el.classList.toggle(className);
    }else {
      var classes = el.className.split(' ');
      var existingIndex = -1;
      for(var i = classes.length; i--;) {
        if(classes[i] === className)
          existingIndex = i;
      }
      if(existingIndex >= 0) {
        classes.splice(existingIndex, 1);
      }else{
        classes.push(className);
      }
      el.className = classes.join(' ');
    }
  },
  addClass(el, className){
    if (el.classList){
      className.split(' ').forEach(classN => {
        el.classList.add(classN);
      })
    }else{
      el.className += ' ' + className;
    }
  }
}