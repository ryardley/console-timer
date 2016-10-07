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

const finish = console.time.bound('foo');
somethingExpensive();
finish(); // foo(203ms)
```

## Name collisions
You can pass in a method map to override the method names if you are worried about collision.

```javascript
import consoleTimer from 'console-timer';
consoleTimer({
  methods: {
    time: 't',
    timeEnd: 'te'
  }
});

console.t('foo');
somethingExpensive();
console.te('foo'); // foo(203ms)
```

## Customize your colors

You can pass a colors object to the options when setting up console-timer for multicoloured ANSI terminals

```javascript
consoleTimer({
  colors: {
    name: 'cyan',
    time: 'yellow',
    msg: 'red',
  }
});
```
## Use objects as references

You can use (mutable) objects as timer keys.

```javascript
console.time(MyComponent);
somethingExpensive();
console.timeEnd(MyComponent); // foo(203ms)
```

## Don't use console if you don't want to

You can use another context if you don't want monkey patched methods on console

```javascript
import consoleTimer from 'console-timer';

let myobj = {};

consoleTimer({context: myobj});

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
