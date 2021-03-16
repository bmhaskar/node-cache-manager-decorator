"use strict";

var _express = _interopRequireDefault(require("express"));

var _user = _interopRequireDefault(require("./repositories/user"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require("dotenv").config();

const app = (0, _express.default)();
const port = process.env.PORT;
app.get("/:id", async function (req, res) {
  const user = await _user.default.fetchUser(req.params.id);
  res.json(user);
});
app.delete("/:id", async function (req, res) {
  const user = await _user.default.deleteUser(req.params.id);
  res.json(user);
});
app.get("/fetchUserWithoutDecorator/:id", async function (req, res) {
  const user = await _user.default.fetchUserWithoutDecorator(req.params.id);
  res.json(user);
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});