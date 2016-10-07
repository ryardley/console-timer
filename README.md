# Console Timer

### A better timer for the console.

I wanted a simple referential timer that I could use that works the same way in all systems. The native console timer functions can be buggy in Chrome and other systems don't even all support it such as older versions of iOS.

However it is useful to have a timer on the global `console` object and not have to require it into your environment when testing performance.

## Usage

```javascript
import consoleTimer from 'console-timer';
consoleTimer();

console.time('foo');
somethingExpensive();
console.timeEnd('foo'); // foo(203ms)
```

## Bound finish function

```javascript
import consoleTimer from 'console-timer';
consoleTimer();

const finish = console.time('foo');
somethingExpensive();
finish(); // foo(203ms)
```

## Name collisions
You can pass in a `methodMap` to override the method names if you are worried about collision.

```javascript
import consoleTimer from 'console-timer';
consoleTimer({
  time: 't',
  timeEnd: 'te',
});

console.t('foo');
somethingExpensive();
console.te('foo'); // foo(203ms)
```

## Use objects as references

You can use objects as timer keys. (Must be mutable)

```javascript
myobj.time(MyComponent);
somethingExpensive();
myobj.timeEnd(MyComponent); // foo(203ms)
```

## Don't use console if you don't want to

You can use another object as context if you don't want it on console

```javascript
import consoleTimer from 'console-timer';

let myobj = {};

consoleTimer(null, myobj);

myobj.time('foo');
somethingExpensive();
myobj.timeEnd('foo'); // foo(203ms)
```

## Multiple starts

Starting a timer multiple times will simply interrupt timer and restart

```javascript
import consoleTimer from 'console-timer';
consoleTimer();

console.time('foo');
console.time('foo'); // foo(0ms) - INTERRUPTED!
somethingExpensive();
console.timeEnd('foo'); // foo(203ms)
```
