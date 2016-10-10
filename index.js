var chalk = require('chalk');
var UNDEFINED_REFERENCE = '__UNDEFINED_REFERENCE__';
// monkey patching console
module.exports = function consoleTimer(options) {

  var defaults = {
    context: console,
    colors: { name: 'white', time: 'white', msg: 'white' }
  };

  var context = options && options.context || defaults.context;
  var colors = options && options.colors || defaults.colors;
  var methodMap = options && options.methods || {};

  var methods = {
    time: time,
    timeEnd: timeEnd,
    disableTimers: disableTimers,
    enableTimers: enableTimers
  };

  var cols = Object.keys(defaults.colors).reduce(function(memo, key) {
    memo[key] = colors[key] || defaults.colors[key];
    return memo;
  }, {});

  // map methods to context
  Object.keys(methods).reduce(function(memo, key) {
    var keyname = methodMap && methodMap[key] || key;
    memo[keyname] = methods[key];
    return memo;
  }, context);

  var timers = {};
  var disabled = false;
  var idcount = 0;

  function getIdemKey(obj) {
    if(typeof obj === 'string') return obj;

    if(!obj) {
      return UNDEFINED_REFERENCE;
    }

    if(!obj._tid_) {
      obj._tid_ = 'id:' + ++idcount;
    }

    return obj._tid_;
  }

  function message(name, timer, message) {
    var text = {
      name: name === UNDEFINED_REFERENCE ? '' : name,
      time: '(' + (Date.now() - timer) + 'ms)',
      msg: message ? ' ' + message : ''
    }

    return [
      chalk[cols.name](text.name),
      chalk[cols.time](text.time),
      chalk[cols.msg](text.msg)
    ].join('');
  }

  /**
   * Start a timer. Pass in a reference string or object to attach the timer to.
   */
  function time(reference) {
    reference = reference || UNDEFINED_REFERENCE;
    if (disabled) return;
    var name = getIdemKey(reference);
    var timer = timers[name];
    if(timer){
      console.log(message(name, timer, '- INTERRUPTED!'));
    }
    timers[name] = Date.now();
  }

  time.bound = function(reference) {
    time(reference);
    return timeEnd.bind(null, reference);
  }

  /**
   * Finish a timer. Pass in a reference string or object to attach the timer to.
   */
  function timeEnd(reference) {
    if (disabled) return;
    var name = getIdemKey(reference);
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
