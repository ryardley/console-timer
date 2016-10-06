// monkey patching console
module.exports = function consoleTimer(methodMap, object) {

  var methods = {
    time: time,
    timeEnd: timeEnd,
    disableTimers: disableTimers,
    enableTimers: enableTimers
  };

  var patchObj = Object.keys(methods).reduce(function(memo, key) {
    var keyname = methodMap && methodMap[key] || key;
    memo[keyname] = methods[key];
    return memo;
  }, object || console);

  var timers = {};
  var disabled = false;
  var idcount = 0;

  function createStringFromObjectRef(obj) {
    if(typeof obj === 'string') return obj;
    if(!obj._tid_) {
      obj._tid_ = 'id:' + ++idcount;
    }
    return obj._tid_;
  }

  function message(name, timer, message) {
    return name +'(' + (Date.now() - timer) + 'ms) ' + (message || '');
  }

  /**
   * Start a timer. Pass in a reference string or object to attach the timer to.
   */
  function time(reference) {
    reference = reference || '__UNDEFINED_REFERENCE__';
    if (disabled) return;
    var name = createStringFromObjectRef(reference);
    var timer = timers[name];
    if(timer){
      console.log(message(name, timer, '- INTERRUPTED!'));
    }
    timers[name] = Date.now();
    return timeEnd.bind(null, reference);
  }

  /**
   * Finish a timer. Pass in a reference string or object to attach the timer to.
   */
  function timeEnd(reference) {
    if (disabled) return;
    var name = createStringFromObjectRef(reference);
    var timer = timers[name];
    if(timer){
      var diff = Date.now() - timer;
      console.log(message(name, timer));
      delete timers[name];
    }
  }

  /**
   * Disable timers
   */
  function disableTimers() {
    disabled = true;
  }

  /**
   * Enable timers
   */
  function enableTimers() {
    disabled = false;
  }
}
