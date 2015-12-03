"use strict";
var UIDManager = require("./UIDManager");

function TimerRepository(config, sequenceGenerator) {
  this.config = config;
  this._sequenceGenerator = sequenceGenerator;
  this.uidManager = new UIDManager();
  this.timers = [];
}

TimerRepository.prototype.insertTimer = function(timer) {
  if(!timer.uid) {
    timer.uid = this.uidManager.getUid();
  }
  timer.sequenceNumber = this._sequenceGenerator.generate();
  
  var i;
  for(i = 0; i < this.timers.length; ++i) {
    // JS timers have no more than 1ms resolution
    if(this.timers[i].dueTime.isLongerThan(timer.dueTime)) {
	  break;
	}
  }
  
  this.timers.splice(i, 0, timer);
  return timer.uid;
};

TimerRepository.prototype.clearTimer = function(uid) {

  var uidValidation = this.uidManager.isAcceptableUid(uid);
  if(!uidValidation.passed) {
	if(this.config.throwOnInvalidClearTimer) {
	  throw new Error("Invalid UID during clearing timer. Reason: " + uidValidation.failureReason);
	}
	
	return;
  }

  var i;
  for(i = 0; i < this.timers.length; ++i) {
    if (this.timers[i].uid === uid) {
      this.timers.splice(i, 1);
	  break;
	}
  }
};

TimerRepository.prototype.releaseAll = function() {
  var earlierTimers = this.timers;
  this.timers = [];
  this.uidManager.clear();
  
  return earlierTimers;
};

TimerRepository.prototype.nextTimer = function() {
  return this.timers[0];
};

TimerRepository.prototype.lastTimer = function() {
  return this.timers[this.timers.length - 1];
};

module.exports = TimerRepository;