"use strict";

var _asyncHelper = require("../utils/asyncHelper");

var _cache = require("../utils/cache");

var _cacheble = require("./cacheble");

var _dec, _dec2, _class, _dec3, _class2;

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

let Todo = (_dec = (0, _cacheble.Cacheable)(100, _cacheble.defaultKeyFn, _cache.memoryCache), _dec2 = (0, _cacheble.InvalidateCache)((name, args) => ["getTodo", args[0]], _cache.memoryCache), (_class = class Todo {
  constructor({
    todo,
    done,
    id
  }) {
    this.todo = todo;
    this.done = done;
    this.id = id;
  }

  getTodo(id) {
    const timeTakingCall = resolve => {
      console.log("simulated I/O call");
      const todo = new Todo({
        todo: "A thing",
        done: false,
        id
      });
      resolve(todo);
    };

    return (0, _asyncHelper.delayed)(timeTakingCall, 300);
  }

  deleteTodo(id) {
    const timeTakingCall = id => resolve => {
      this.id = null;
      this.todo = null;
      this.done = null;
      resolve();
    };

    return (0, _asyncHelper.delayed)(timeTakingCall(id), 300);
  }

}, (_applyDecoratedDescriptor(_class.prototype, "getTodo", [_dec], Object.getOwnPropertyDescriptor(_class.prototype, "getTodo"), _class.prototype), _applyDecoratedDescriptor(_class.prototype, "deleteTodo", [_dec2], Object.getOwnPropertyDescriptor(_class.prototype, "deleteTodo"), _class.prototype)), _class));
let Todos = (_dec3 = (0, _cacheble.Cacheable)(100, _cacheble.defaultKeyFn, _cache.memoryCache), (_class2 = class Todos {
  constructor(todos) {
    this.todos = todos;
  }

  getTodos() {
    const timeTakingCall = resolve => {
      console.log("simulated I/O call");
      resolve(new Todos([new Todo({
        todo: "A thing",
        done: false
      })]));
    };

    return (0, _asyncHelper.delayed)(timeTakingCall, 300);
  }

}, (_applyDecoratedDescriptor(_class2.prototype, "getTodos", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "getTodos"), _class2.prototype)), _class2));
const todos = new Todos([new Todo({
  todo: "A thing to do",
  done: false
})]);
describe("@Cacheble Decorator", () => {
  const spy = jest.spyOn(console, "log");
  beforeEach(async () => {
    jest.resetAllMocks();
    await _cache.memoryCache.reset();
  });
  test("should call once", async done => {
    await todos.getTodos();
    await todos.getTodos();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after reset", async done => {
    await todos.getTodos();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after delete", async done => {
    await todos.getTodos();

    _cache.memoryCache.del('["getTodos"]');

    await todos.getTodos();
    expect(spy).toHaveBeenCalledTimes(2);
    done();
  });
  test("should be recalled after delete with auto invalidation", async done => {
    const todo = new Todo({});
    const todoObj = await todo.getTodo("1");
    const cachedTodo = await _cache.memoryCache.get('["getTodo","1"]');
    expect(cachedTodo.id).toBe(todoObj.id);
    await todo.deleteTodo("1");
    const afterDeleteCachedTodo = await _cache.memoryCache.get('["getTodo","1"]');
    expect(afterDeleteCachedTodo).not.toBeDefined();
    done();
  });
});