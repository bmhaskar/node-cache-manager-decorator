"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisInstance = void 0;

var _ioredis = _interopRequireDefault(require("ioredis"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const redisInstance = new _ioredis.default({
  host: "localhost",
  port: 6379,
  db: 0
});
exports.redisInstance = redisInstance;