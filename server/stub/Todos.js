import { delayed } from "../utils/asyncHelper";
import { memoryCache } from "../utils/cache";
import { Cacheable } from "../decorators/cacheble";
import { defaultKeyFn } from "../decorators/defaultKeyFn";
import { Todo } from "./Todo";

export class Todos {
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
