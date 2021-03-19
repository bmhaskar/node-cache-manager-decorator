import { EventEmitter } from "events";

class Lock {
  constructor() {
    this.locker = new WeakMap();
    this.signal = new EventEmitter();
  }

  isLocked(key) {
    return this.locker.has({ key }) ? this.locker.get({ key }) : false;
  }

  acquire(key) {
    return new Promise((resolve) => {
      // If nobody has the lock, take it and resolve immediately
      if (!this.isLocked(key)) {
        // Safe because JS doesn't interrupt you on synchronous operations,
        // so no need for compare-and-swap or anything like that.
        this.locker.set({ key }, true);
        return resolve();
      }
      // Otherwise, wait until somebody releases the lock and try again
      const tryAgain = (value) => {
        if (!this.isLocked(key)) {
          this.locker.set({ key }, true);
          this.signal.removeListener(key, tryAgain);
          return resolve(value);
        }
      };
      this.signal.on(key, tryAgain);
    });
  }

  release(key, value) {
    // Release the lock immediately
    this.locker.set({ key }, false);
    setImmediate(() => this.signal.emit(key, value));
  }
}

export default Lock;
