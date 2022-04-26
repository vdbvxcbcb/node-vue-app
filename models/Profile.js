// 引入 mongoose
const mongoose = require("mongoose")
// 引入 mongoose 的骨架
const Schema = mongoose.Schema
// 创建资金流水骨架
const profileSchema = new Schema({
  type: {
    type: String,
  },
  desc: {
    type: String,
  },
  income: {
    type: String,
    required: true,
  },
  expenses: {
    type: String,
    required: true,
  },
  cash: {
    type: String,
    required: true,
  },
  remark: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
})
// 使用 mongoose 创建资金流水模型
const Profile = mongoose.model("profile", profileSchema)
// 导出资金流水模型
module.exports = Profile 
