import { delayed } from "../utils/asyncHelper";

class User {
  constructor(args) {
    this.id = args.id;
    this.name = args.name;
  }
  static get(id) {
    return delayed((resolve) => {
      // simulated I/O
      console.log("simulated I/O call");
      resolve(new User({ id: id, name: "bob" }));
    }, 300);
  }
}

export default User;
