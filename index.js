// monkey patching console
module.exports = function consoleTimePolyfill(force) {
  
  force = force || false;
  var timers = {};
  if(force || !console.time) {
    console.time = function(name) {
      timers[name] = Date.now();
    }
  }
  
  if(force || !console.timeEnd) {
    console.timeEnd = function(name) {
      if(timers[name]){
        var diff = Date.now() - timers[name];
        console.log(name + ': ' + Date.now() - timers[name] + 'ms');
        delete timers[name];
      }
    }
  }
}
