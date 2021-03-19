import { Todo } from "../stub/Todo";
import { memoryCache } from "../utils/cache";

describe("@Cacheble Decorator", () => {
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
