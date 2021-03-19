import { EventEmitter } from "events";

class Lock {
  constructor() {
    this._locked = new WeakMap();
    this._ee = new EventEmitter();
  }

  isLocked(key) {
    return this._locked.has({ key }) ? this._locked.get({ key }) : false;
  }

  acquire(key) {
    return new Promise((resolve) => {
      // If nobody has the lock, take it and resolve immediately
      if (!this.isLocked(key)) {
        // Safe because JS doesn't interrupt you on synchronous operations,
        // so no need for compare-and-swap or anything like that.
        this._locked.set({ key }, true);
        return resolve();
      }
      // Otherwise, wait until somebody releases the lock and try again
      const tryAcquire = (value) => {
        if (!this.isLocked(key)) {
          this._locked.set({ key }, true);
          this._ee.removeListener(key, tryAcquire);
          return resolve(value);
        }
      };
      this._ee.on(key, tryAcquire);
    });
  }

  release(key, value) {
    // Release the lock immediately
    this._locked.set({ key }, false);
    setImmediate(() => this._ee.emit(key, value));
  }
}

export default Lock;
