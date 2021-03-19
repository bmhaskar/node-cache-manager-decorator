import cache from "../utils/cache";
import { stableValueHash } from "../utils/objectHelper";
import { defaultKeyFn } from "./defaultKeyFn";

export function InvalidateCache(
  keyFn = defaultKeyFn,
  cacheManagerInstance = cache
) {
  return (target, name, descriptor) => {
    const method = descriptor.value;
    descriptor.value = async function (...args) {
      const key = stableValueHash(keyFn(name, args));
      try {
        await method.apply(this, args);
        await cacheManagerInstance.del(key);
      } catch (e) {
        console.log(e);
        throw e;
      }
    };
    return descriptor;
  };
}
