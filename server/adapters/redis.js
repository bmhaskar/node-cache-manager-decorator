import Redis from "ioredis";

export const redisInstance = new Redis({
  host: "localhost",
  port: 6379,
  db: 0,
});
