"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.delayed = void 0;

const delayed = (fn, timeout = 3000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => fn(resolve, reject), timeout);
  });
};

exports.delayed = delayed;