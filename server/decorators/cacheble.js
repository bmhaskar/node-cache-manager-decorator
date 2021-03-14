import cache from "../utils/cache";
import Lock from "../utils/lock";

const lock = new Lock();

export const Cacheble = (keyFn, cacheManagerInstance = cache) => {
  return (target, name, descriptor) => {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
      if (!keyFn) {
        keyFn = (args) => [name, args[0]];
      }
      const key = stableValueHash(keyFn(args));
      const cachedResult = await cacheManagerInstance.get(key);
      console.log("key", key, cachedResult);
      if (cachedResult) {
        return cachedResult;
      }

      await lock.acquire();
      let result = null;
      try {
        result = await method.apply(this, args);
        await cacheManagerInstance.set(key, result);
      } finally {
        lock.release();
      }
      return result;
    };
    return descriptor;
  };
};

export function stableValueHash(value) {
  return JSON.stringify(value, (_, val) =>
    isPlainObject(val)
      ? Object.keys(val)
          .sort()
          .reduce((result, key) => {
            result[key] = val[key];
            return result;
          }, {})
      : val
  );
}

// Copied from: https://github.com/jonschlinkert/is-plain-object
export function isPlainObject(o) {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === "undefined") {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
