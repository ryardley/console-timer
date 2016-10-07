const chalk = require('chalk');

function takeAWhile(howLong){
  var array = [];
  for(var i = 0; i < howLong; i++) {
    var obj = {};
    obj.foo = i;
    obj.bar = i + ':';
    array.push(obj);
  }
}

var lastMsg = '';
var oldlog = console.log.bind(console);
console.log = function(msg) {
  lastMsg = msg;
}

function lastLogMatches(regx) {
  var stripped = lastMsg.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
  var match = stripped.match(regx);
  oldlog(match ? chalk.green('PASSED!') : chalk.red('FAILED!'));
  if(!match){
    throw new Error('Test failure at: ' + stripped);
  }
  lastMsg = '';
}

require('./index')({
  methods: {
    time: 't',
    timeEnd: 'te',
    disableTimers: 'tdisable'
  }
});

var myobj = {foo:'foo'};
console.log('test timer restart');
console.t(myobj);
takeAWhile(100000);
console.t(myobj);
lastLogMatches(/^id\:1\(\d*ms\) - INTERRUPTED\!$/);
takeAWhile(100000);
console.te(myobj);
lastLogMatches(/id\:1\(\d*ms\)/);
console.log('ending timer');

console.log('test empty timer reference');
console.t();
takeAWhile(100000);
console.te();
lastLogMatches(/\(\d*ms\)/);
console.log('end test empty timer reference');

console.tdisable();
console.log('should output nothing');
console.t(myobj);
takeAWhile(100000);
console.te(myobj);
lastLogMatches();
console.log('did output nothing');
console.enableTimers();

console.log('test bound function');
var end = console.t.bound('myobj');
takeAWhile(100000);
end();
lastLogMatches(/myobj\(\d*ms\)/);
