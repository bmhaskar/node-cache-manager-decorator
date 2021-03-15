import { delayed } from "../utils/asyncHelper";
import cache, { memoryCache } from "../utils/cache";
import { Cacheble, defaultKeyFn } from "./cacheble";

class Todos {
  constructor(todos) {
    this.todos = todos;
  }
  @Cacheble(100, defaultKeyFn, memoryCache)
  getTods() {
    const timeTakingCall = (resolve) => {
      console.log("simulated I/O call");
      resolve(new Todos([{ todo: "A thing", done: false }]));
    };
    return delayed(timeTakingCall, 300);
  }
}

const todos = new Todos();
describe("@Cacheble Decorator", () => {
  const spy = jest.spyOn(console, "log");
  beforeEach(async () => {
    jest.resetAllMocks();
    await memoryCache.reset();
  });
  test("should call once", async (done) => {
    await todos.getTods();
    await todos.getTods();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after reset", async (done) => {
    await todos.getTods();
    expect(spy).toHaveBeenCalledTimes(1);
    done();
  });
  test("should be recalled after delete", async (done) => {
    await todos.getTods();
    memoryCache.del('["getTods"]');
    await todos.getTods();
    expect(spy).toHaveBeenCalledTimes(2);
    done();
  });
});
