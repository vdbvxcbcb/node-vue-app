<template>
  <div class="dialog">
    <el-dialog 
    :title="dialog.title"
    :visible.sync="dialog.show"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :modal-append-to-body="false"
    class="above_dialog">
      <div class="form">        
        <el-form 
          ref="form" 
          :model="formData" 
          :rules="form_rules"
          label-width="120px"
          style="margin:10px"
        >
        
          <el-formItem label="收支类型:">
            <el-select v-model="formData.type" placeholder="收支类型">
              <el-option 
                v-for="(formtype, index) in form_type_list" 
                :key="index"
                :label="formtype"
                :value="formtype">
              </el-option>
            </el-select>
          </el-formItem>

          <el-formItem label="收支描述:" prop="desc">
            <el-input type="desc" v-model="formData.desc"></el-input>
          </el-formItem>

          <el-form-item label="收入:" prop="income">
            <el-input type="income" v-model="formData.income"></el-input>
          </el-form-item>

          <el-form-item label="支出:" prop="expenses">
            <el-input type="expenses" v-model="formData.expenses"></el-input>
          </el-form-item>

          <el-form-item label="账户现金:" prop="cash">
            <el-input type="cash" v-model="formData.cash"></el-input>
          </el-form-item>

           <el-form-item label="备注:">
            <el-input type="textarea remark" v-model="formData.remark"></el-input>
          </el-form-item>    

          <el-form-item class="">
            <el-button type="primary" @click="submitForm('form')">提 交</el-button>   
            <el-button @click="dialog.show = false">取 消</el-button>   
          </el-form-item>      
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    // 问题 组件名不可以与 html元素同名
    name: 'add-dialog',
    props: {
      dialog: Object,
      formData: Object
    },
    data() {
      return {
        form_type_list: [
          "电影",
          "提现",
          "提现手续费",
          "充值",
          "优惠券",
          "充值礼券",
          "转账"
        ],
        form_rules: {
          desc: [
            { required: true, message: "收支描述不能为空！", trigger: "blur" }
          ],
          income: [
            { required: true, message: "收入不能为空！", trigger: "blur" }
          ],
          expenses: [
            { required: true, message: "支出不能为空！", trigger: "blur" }
          ],
          cash: [
            { required: true, message: "账户现金不能为空！", trigger: "blur" }
          ]
        },
        message: ''
      }
    },
    methods: {
      submitForm(form) {
        this.$refs[form].validate(valid => {
          if (valid) { 
            // console.log(this.formData)
            const url = this.dialog.option === 'add' ? 'add' : `edit/${this.formData._id}`
            this.message = url === 'add' ? '添加' : '编辑'
            this.$axios.post(`/api/profiles/${url}`, this.formData)
            .then(res => {
              this.$message({
                message: `数据${this.message}成功`,
                type: 'success'
              })
              this.dialog.show = false;
              this.$emit('update')
            })
          }
        })
      }
    },
  }
</script>

<style scoped>
.above_dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.form {
  height: 70%;
}
</style>
// 修改 element UI 默认样式
<style>
.el-dialog__body {
  padding: 6px 20px
}
</style>
