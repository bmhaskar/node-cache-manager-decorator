import { delayed } from "../utils/asyncHelper";
import { memoryCache } from "../utils/cache";
import { Cacheable } from "../decorators/cacheble";
import { defaultKeyFn } from "../decorators/defaultKeyFn";
import { InvalidateCache } from "../decorators/invalidateCache";

export class Todo {
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
