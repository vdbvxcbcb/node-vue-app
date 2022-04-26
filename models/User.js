// 引入 mongoose
const mongoose = require("mongoose");
// 引入 mongoose 的骨架
const Schema = mongoose.Schema;
// 创建用户骨架 用户所有信息的数据库字段
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  identity: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    default: Date.now,
  },
})
// 使用 mongoose 创建用户模型
const User = mongoose.model("user", userSchema);
// 导出用户模型
module.exports = User