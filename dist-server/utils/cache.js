"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.redisCache = exports.memoryCache = void 0;

var _cacheManager = _interopRequireDefault(require("cache-manager"));

var _cacheManagerIoredis = _interopRequireDefault(require("cache-manager-ioredis"));

var _redis = require("../adapters/redis");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const memoryCache = _cacheManager.default.caching({
  store: "memory",
  max: 100,
  ttl: 100
  /*seconds*/

}); // Documentation can be found at
// https://github.com/dabroek/node-cache-manager-ioredis


exports.memoryCache = memoryCache;

const redisCache = _cacheManager.default.caching({
  store: _cacheManagerIoredis.default,
  db: 0,
  ttl: 600,
  redisInstance: _redis.redisInstance
});

exports.redisCache = redisCache;

const cache = _cacheManager.default.multiCaching([memoryCache, redisCache]);

var _default = cache;
exports.default = _default;