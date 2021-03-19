import { memoryCache } from "../utils/cache";
import { Todo } from "../stub/Todo";
import { Todos } from "../stub/Todos";

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
});
