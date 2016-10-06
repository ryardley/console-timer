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
  var match = lastMsg.match(regx);
  oldlog(match ? 'PASSED!' : 'FAILED!');
  if(!match){
    throw new Error('Test failure!');
  }
  lastMsg = '';
}

require('./index')({
  time: 't',
  timeEnd: 'te',
  disableTimers: 'tdisable'
});

var myobj = {foo:'foo'};
console.log('test timer restart');
console.t(myobj);
takeAWhile(100000);
console.t(myobj);
lastLogMatches(/^id\:1\(\d*ms\) - INTERRUPTED\!$/);
takeAWhile(100000);
console.te(myobj);
lastLogMatches(/id\:1\(\d*ms\) /);
console.log('ending timer');


console.tdisable();
console.log('should output nothing');
console.t(myobj);
takeAWhile(100000);
console.te(myobj);
lastLogMatches();
console.log('did output nothing');
console.enableTimers();

console.log('test bound function');
var end = console.t('myobj');
takeAWhile(100000);
end();
lastLogMatches(/myobj\(\d*ms\) /);
