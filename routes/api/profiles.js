// 引入 express
const express = require('express')
// 创建路由实例
const router = express.Router()
// 引入 Profile 模型
const Profile = require('../../models/Profile')
// 引入 passport中间件
const passport = require('passport')

// 创建测试路由
// 公共接口  GET api/profiles/test
// 返回 json 数据
// router.get("/test", (req, res) => {
//   res.json({msg: "Test"})
// })

// 创建添加资金路由
// 私有接口  Post api/profiles/add
// 返回 json 数据
router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const profileFields = {}
    if (req.body.type) profileFields.type = req.body.type
    if (req.body.desc) profileFields.desc = req.body.desc
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expenses) profileFields.expenses = req.body.expenses
    if (req.body.cash) profileFields.cash = req.body.cash
    if (req.body.remark) profileFields.remark = req.body.remark
    const profile = await new Profile(profileFields).save()
    res.json(profile)
  }
)

// 编辑资金
// 私有接口  Post api/profiles/edit
// 返回 json 数据
router.post(
  '/edit/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const profileFields = {}
    if (req.body.type) profileFields.type = req.body.type
    if (req.body.desc) profileFields.desc = req.body.desc
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expenses) profileFields.expenses = req.body.expenses
    if (req.body.cash) profileFields.cash = req.body.cash
    if (req.body.remark) profileFields.remark = req.body.remark
    const profile = await Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    )
    res.json(profile)
  }
)

// 查询所有资金
// 私有接口  Get api/profiles
// 返回 json 数据
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profiles = await Profile.find()
      if (!profiles) {
        return res.status(404).json('没有任何内容')
      }
      res.json(profiles)
    } catch (ex) {
      console.log(res.status(404).json(ex))
    }
  }
)

// 查询单个资金 根据 id
// 私有接口  Get api/profiles/:id
// 返回 json 数据
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profiles = await Profile.find({ _id: req.params.id })
      if (!profiles) {
        return res.status(404).json('没有任何内容')
      }
      res.json(profiles)
    } catch (ex) {
      console.log(res.status(404).json(ex))
    }
  }
)

// 删除一条资金
// 私有接口  Delete api/profiles/delete/:id
// 返回 json 数据
router.delete(
  '/delete/:id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      // 问题 删除之后不需要 save
      const profile = await Profile.findByIdAndRemove({ _id: req.params.id })
      res.json(profile)
    } catch (ex) {
      console.log(res.status(404).json('删除失败'))
    }
  }
)

// 批量删除多条资金
// 私有接口  Delete api/profiles/multiDelete
// 返回 json 数据
router.post(
  '/multiDelete',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    let arr = req.body
    const profile = await Profile.deleteMany({ _id: { $in: arr } }, (err) => {
      if (err) {
        console.log(res.status(404).json('删除失败'))
      }
    })
    res.json(profile)
  }
)

// 导出路由中间件
module.exports = router
