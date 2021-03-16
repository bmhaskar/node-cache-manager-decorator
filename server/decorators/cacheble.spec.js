import { delayed } from "../utils/asyncHelper";
import { memoryCache } from "../utils/cache";
import { Cacheable, defaultKeyFn, InvalidateCache } from "./cacheble";

class Todo {
  constructor({ todo, done, id }) {
    this.todo = todo;
    this.done = done;
    this.id = id;
  }
  @Cacheable(100, defaultKeyFn, memoryCache)
  getTodo(id) {
    const timeTakingCall = (resolve) => {
      console.log("simulated I/O call");
      const todo = new Todo({ todo: "A thing", done: false, id });
      resolve(todo);
    };
    return delayed(timeTakingCall, 300);
  }
  @InvalidateCache((name, args) => ["getTodo", args[0]], memoryCache)
  deleteTodo(id) {
    const timeTakingCall = (id) => (resolve) => {
      this.id = null;
      this.todo = null;
      this.done = null;
      resolve();
    };
    return delayed(timeTakingCall(id), 300);
  }
}
class Todos {
  constructor(todos) {
    this.todos = todos;
  }
  @Cacheable(100, defaultKeyFn, memoryCache)
  getTodos() {
    const timeTakingCall = (resolve) => {
      console.log("simulated I/O call");
      resolve(new Todos([new Todo({ todo: "A thing", done: false })]));
    };
    return delayed(timeTakingCall, 300);
  }
}

const todos = new Todos([new Todo({ todo: "A thing to do", done: false })]);
describe("@Cacheble Decorator", () => {
  const spy = jest.spyOn(console, "log");
  beforeEach(async () => {
    jest.resetAllMocks();
    await memoryCache.reset();
  });
  test("should call once", async (done) => {
    await todos.getTodos();
    await todos.getTodos();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after reset", async (done) => {
    await todos.getTodos();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after delete", async (done) => {
    await todos.getTodos();
    memoryCache.del('["getTodos"]');
    await todos.getTodos();
    expect(spy).toHaveBeenCalledTimes(2);
    done();
  });
  test("should be recalled after delete with auto invalidation", async (done) => {
    const todo = new Todo({});
    const todoObj = await todo.getTodo("1");

    const cachedTodo = await memoryCache.get('["getTodo","1"]');
    expect(cachedTodo.id).toBe(todoObj.id);
    await todo.deleteTodo("1");
    const afterDeleteCachedTodo = await memoryCache.get('["getTodo","1"]');
    expect(afterDeleteCachedTodo).not.toBeDefined();

    done();
  });
});
