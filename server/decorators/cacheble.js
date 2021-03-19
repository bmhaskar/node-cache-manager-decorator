import cache from "../utils/cache";
import Lock from "../utils/lock";
import { stableValueHash } from "../utils/objectHelper";
import { defaultKeyFn } from "./defaultKeyFn";

const lock = new Lock();

export const Cacheable = (
  config,
  keyFn = defaultKeyFn,
  cacheManagerInstance = cache
) => (target, name, descriptor) => {
  const method = descriptor.value;
  descriptor.value = async function (...args) {
    const key = stableValueHash(keyFn(name, args));
    const cachedResult = await cacheManagerInstance.get(key);

    if (cachedResult) {
      return cachedResult;
    }

    let result = await lock.acquire(key);
    if (!result) {
      try {
        result = await method.apply(this, args);
        // console.log("Result", result);
        await cacheManagerInstance.set(key, result, config);
      } catch (e) {
        console.log(e);
      } finally {
        lock.release(key, result);
      }
    }
    return result;
  };
  return descriptor;
};
