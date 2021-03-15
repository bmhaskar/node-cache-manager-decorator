"use strict";

var _asyncHelper = require("../utils/asyncHelper");

var _cache = _interopRequireWildcard(require("../utils/cache"));

var _cacheble = require("./cacheble");

var _dec, _class;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let Todos = (_dec = (0, _cacheble.Cacheble)(100, _cacheble.defaultKeyFn, _cache.memoryCache), (_class = class Todos {
  constructor(todos) {
    this.todos = todos;
  }

  getTods() {
    const timeTakingCall = resolve => {
      console.log("simulated I/O call");
      resolve(new Todos([{
        todo: "A thing",
        done: false
      }]));
    };

    return (0, _asyncHelper.delayed)(timeTakingCall, 300);
  }

}, (_applyDecoratedDescriptor(_class.prototype, "getTods", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "getTods"), _class.prototype)), _class));
const todos = new Todos();
describe("@Cacheble Decorator", () => {
  const spy = jest.spyOn(console, "log");
  beforeEach(async () => {
    jest.resetAllMocks();
    await _cache.memoryCache.reset();
  });
  test("should call once", async done => {
    await todos.getTods();
    await todos.getTods();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after reset", async done => {
    await todos.getTods();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after delete", async done => {
    await todos.getTods();

    _cache.memoryCache.del('["getTods"]');

    await todos.getTods();
    expect(spy).toHaveBeenCalledTimes(2);
    done();
  });
});