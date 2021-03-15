"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stableValueHash = stableValueHash;
exports.isPlainObject = isPlainObject;
exports.Cacheble = exports.defaultKeyFn = void 0;

var _cache = _interopRequireDefault(require("../utils/cache"));

var _lock = _interopRequireDefault(require("../utils/lock"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const lock = new _lock.default();

const defaultKeyFn = (name, args) => {
  const defaultKey = [name];

  if (Array.isArray(args) && args.length) {
    defaultKey.push(args[0]);
  }

  return defaultKey;
};

exports.defaultKeyFn = defaultKeyFn;

const Cacheble = (config, keyFn = defaultKeyFn, cacheManagerInstance = _cache.default) => {
  return (target, name, descriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args) {
      const key = stableValueHash(keyFn(name, args));
      const cachedResult = await cacheManagerInstance.get(key); //   console.log("key", key, cachedResult);

      if (cachedResult) {
        return cachedResult;
      }

      await lock.acquire();
      let result = null;

      try {
        result = await method.apply(this, args); // console.log("Result", result);

        await cacheManagerInstance.set(key, result);
      } catch (e) {
        console.log(e);
      } finally {
        lock.release();
      }

      return result;
    };

    return descriptor;
  };
};

exports.Cacheble = Cacheble;

function stableValueHash(value) {
  return JSON.stringify(value, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
} // Copied from: https://github.com/jonschlinkert/is-plain-object


function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  } // If has modified constructor


  const ctor = o.constructor;

  if (typeof ctor === "undefined") {
    return true;
  } // If has modified prototype


  const prot = ctor.prototype;

  if (!hasObjectPrototype(prot)) {
    return false;
  } // If constructor does not have an Object-specific method


  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  } // Most likely a plain Object


  return true;
}

function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}