"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cacheble = require("../decorators/cacheble");

var _User = _interopRequireDefault(require("../models/User"));

var _cache = _interopRequireDefault(require("../utils/cache"));

var _dec, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let UserRepository = (_dec = (0, _cacheble.Cacheble)(), (_class = class UserRepository {
  constructor(userModel) {
    this.model = userModel;
  }
  /**
   * Wraps User.get() with cache.wrap().
   * First call to this function will call User.get and
   * cache the result. Subsequent requests, until the cache TTL
   * has expired, will return the user from cache.
   */


  async fetchUserWithoutDecorator(id) {
    var cacheKey = "user_" + id;
    let user = await _cache.default.get(cacheKey);
    console.log(cacheKey, user);

    if (!user) {
      console.log("Fetching user from slow database");
      user = await this.model.get(id);
      await _cache.default.set(cacheKey, user);
    }

    return user;
  }

  async fetchUser(id) {
    const user = await this.model.get(id);
    return user;
  }

}, (_applyDecoratedDescriptor(_class.prototype, "fetchUser", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "fetchUser"), _class.prototype)), _class));
const userRepository = new UserRepository(_User.default);
var _default = userRepository;
exports.default = _default;