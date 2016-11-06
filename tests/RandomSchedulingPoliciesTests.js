"use strict";
var assert = require("assert");
var zurvan = require("../zurvan");
var TimeUnit = require("../TimeUnit");

function setTestTimers(calls) {
  setTimeout(function() {
    calls.push(1);
  }, 100);
  setInterval(function() {
    calls.push(2);
  }, 100);
  setTimeout(function() {
    calls.push(3);
  },100);
  setTimeout(function() {
    calls.push(4);
  },100);
  setTimeout(function() {
    calls.push(6);
  },200);
  setTimeout(function() {
    calls.push(7);
  },300);
  setInterval(function() {
    calls.push(5);
  }, 100);
}

describe('zurvan schedules timers at same dueTime', function() {
  it('can expire timeouts first in random order', function() {
    var calls = [];
    return zurvan.interceptTimers({ timerExpirationPolicy: "Timeouts-First-Random" })
      .then(function() {
        setTestTimers(calls);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(1) <= 2);
        assert(calls.indexOf(3) <= 2);
        assert(calls.indexOf(4) <= 2);
        assert(calls.indexOf(2) >= 3);
        assert(calls.indexOf(2) <= 4);
        assert(calls.indexOf(5) >= 3);
        assert(calls.indexOf(5) <= 4);
        calls.splice(0, calls.length);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(6) === 0);
        assert(calls.indexOf(2) >= 1);
        assert(calls.indexOf(2) <= 2);
        assert(calls.indexOf(5) >= 1);
        assert(calls.indexOf(5) <= 2);
        calls.splice(0, calls.length);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(7) === 0);
        assert(calls.indexOf(2) >= 1);
        assert(calls.indexOf(2) <= 2);
        assert(calls.indexOf(5) >= 1);
        assert(calls.indexOf(5) <= 2);
        calls.splice(0, calls.length);
        return zurvan.releaseTimers();
      });
  });
    
  it('can expire intervals first in random order', function() {
    var calls = [];
    return zurvan.interceptTimers({ timerExpirationPolicy: "Intervals-First-Random" })
      .then(function() {
        setTestTimers(calls);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(2) <= 1);
        assert(calls.indexOf(5) <= 1);
        assert(calls.indexOf(1) <= 4);
        assert(calls.indexOf(1) >= 2);
        assert(calls.indexOf(3) <= 4);
        assert(calls.indexOf(3) >= 2);
        assert(calls.indexOf(4) <= 4);
        assert(calls.indexOf(4) >= 2);
        calls.splice(0, calls.length);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(2) <= 1);
        assert(calls.indexOf(5) <= 1);
        assert(calls.indexOf(6) == 2);
        calls.splice(0, calls.length);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(2) <= 1);
        assert(calls.indexOf(5) <= 1);
        assert(calls.indexOf(7) === 2);
        calls.splice(0, calls.length);
        return zurvan.releaseTimers();
      });
  });
  
  it('can expire timeouts at random', function() {
    var calls = [];
    return zurvan.interceptTimers({ timerExpirationPolicy: "Random" })
      .then(function() {
        setTestTimers(calls);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(2) !== -1);
        assert(calls.indexOf(5) !== -1);
        assert(calls.indexOf(1) !== -1);
        assert(calls.indexOf(3) !== -1);
        assert(calls.indexOf(4) !== -1);
        calls.splice(0, calls.length);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(2) !== -1);
        assert(calls.indexOf(5) !== -1);
        assert(calls.indexOf(6) !== -1);
        calls.splice(0, calls.length);
        return zurvan.advanceTime(TimeUnit.milliseconds(100));
      })
      .then(function() {
        assert(calls.indexOf(2) !== -1);
        assert(calls.indexOf(5) !== -1);
        assert(calls.indexOf(7) !== -1);
        calls.splice(0, calls.length);
        return zurvan.releaseTimers();
      });
  });
});