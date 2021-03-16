import cacheManager from "cache-manager";
import redisStore from "cache-manager-ioredis";
import { redisInstance } from "../adapters/redis";
export const memoryCache = cacheManager.caching({
  store: "memory",
  max: 100,
  ttl: 100 /*seconds*/,
});

// Documentation can be found at
// https://github.com/dabroek/node-cache-manager-ioredis
export const redisCache = cacheManager.caching({
  store: redisStore,
  db: 0,
  ttl: 600,
  redisInstance,
});
const cache = cacheManager.multiCaching([memoryCache, redisCache]);
export default cache;
