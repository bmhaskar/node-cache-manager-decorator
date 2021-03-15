import { Cacheble } from "../decorators/cacheble";
import UserModel from "../models/User";
import cache from "../utils/cache";

class UserRepository {
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
    let user = await cache.get(cacheKey);
    console.log(cacheKey, user);

    if (!user) {
      user = await this.model.get(id);
      await cache.set(cacheKey, user);
    }
    return user;
  }
  @Cacheble()
  async fetchUser(id) {
    return await this.model.get(id);
  }
}

const userRepository = new UserRepository(UserModel);
export default userRepository;
