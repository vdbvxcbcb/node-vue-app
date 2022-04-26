<template>
  <div class="fillContainer">
    <div class="fundList-content">
      <!-- 设置 inline 属性让表单域变为行内的表单域 -->
      <el-form :inline="true" ref="add_data" :model="searchData">
        <el-form-item label="按时间筛选:">
          <el-date-picker
            v-model="searchData.startTime"
            type="datetime"
            placeholder="选择开始时间"
            @change="changeStart"
          >
          </el-date-picker>
          --
          <el-date-picker
            v-model="searchData.endTime"
            type="datetime"
            placeholder="选择结束时间"
            @change="changeEnd"
          >
          </el-date-picker>
          <el-button
            class="search"
            type="primary"
            size="small"
            @click="handleSearch"
            >筛选</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-input placeholder="输入描述" v-model="search" clearable>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchItem"
            ></el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="btnRight">
          <el-button
            v-if="user.identity === 'manager'"
            type="primary"
            size="small"
            @click="handleAdd"
            >添加</el-button
          >
          <el-button
            :disabled="!multipleSelectionFlag"
            type="danger"
            size="small"
            icon="el-icon-delete"
            class="handle-del ml10"
            @click="delAllSelection"
            >批量删除</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-if="tableData.length > 0"
      :default-sort="{ prop: 'date', order: 'ascending' }"
      max-height="400"
      border
      :data="tableData"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      @row-click="rowClick"
      :row-style="rowStyle"
      :row-class-name="rowClassName"
      ref="multipleTable"
    >
      <el-table-column type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column type="index" label="序号" width="50" align="center">
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建时间"
        align="center"
        width="190"
        sortable
      >
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.date | showDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="收支类型" align="center">
      </el-table-column>
      <el-table-column prop="desc" label="收支描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="income" label="收入" align="center">
        <template slot-scope="scope">
          <span style="color:#00d053">+ {{ scope.row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="expenses" label="支出" align="center">
        <template slot-scope="scope">
          <span style="color:#f56767">- {{ scope.row.expenses }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cash" label="账户现金" align="center">
        <template slot-scope="scope">
          <span style="color:#4db3ff">{{ scope.row.cash }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button
            v-if="user.identity === 'manager'"
            size="small"
            type="info"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
          <el-button
            v-if="user.identity === 'manager'"
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row>
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            v-if="paginations.total > 0"
            :total="paginations.total"
            :page-size="paginations.page_size"
            :current-page.sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :layout="paginations.layout"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <Add-Dialog
      :dialog="dialog"
      :formData="formData"
      @update="getFundList"
    ></Add-Dialog>
  </div>
</template>

<script>
import AddDialog from '../components/AddDialog'
import { formatDate } from '../utils/formatDate'
// import bus from '../components/bus'
export default {
  name: 'fundlist',
  components: {
    AddDialog,
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
  },
  data() {
    return {
      // 根据日期搜索的时间数据
      searchData: {
        startTime: '',
        endTime: '',
      },
      // 默认是否折叠
      // collapse: false,
      // 搜索描述字符串
      search: '',
      // start: false,
      // end: false,
      // 搜索（过滤）表单的数据
      filterTableData: [],
      // 所有分页的数据
      allTableData: [],
      // 当前分页的数据
      tableData: [],
      // 删除的表单数据
      delList: [],
      // 选中的表格行
      selectionRow: [],
      multipleSelection: [],
      multipleSelectionFlag: false,
      // 表单数据
      formData: {
        type: '',
        desc: '',
        income: '',
        expenses: '',
        cash: '',
        remark: '',
        id: '',
      },
      // 弹出框默认为编辑弹出框且不显示
      dialog: {
        show: false,
        title: '',
        option: 'edit',
      },
      // 分页器
      paginations: {
        total: 0, // 总页数
        page_size: 5, // 一页显示多少条
        page_index: 1, // 当前位于哪页
        page_sizes: [5, 10, 15, 20], // 选择一页显示多少条
        layout: 'total, sizes, prev, pager, next, jumper', // 组件分页布局
      },
    }
  },
  // 创建组件时显示资金流水
  created() {
    this.getFundList()
    // bus.$on('collapse-content', msg => {
    //   this.collapse = msg;
    // });
  },
  // 当搜索描述没有值时刷新表单
  watch: {
    search: function(newVal) {
      if (newVal === '') {
        this.getFundList()
      }
    },
  },
  methods: {
    // 获取列表数据
    getFundList() {
      this.$axios
        .get('/api/profiles')
        .then((res) => {
          // this.tableData = res.data
          // console.log(res)
          // console.log(res.data)
          this.allTableData = res.data
          // 先获取所有数据作为要过滤的数据
          this.filterTableData = res.data
          // console.log(res.data)
          // 显示分页数据
          this.setPagination()
        })
        .catch((err) => console.log(err))
    },
    // 初始化或获取当前分页数据
    setPagination() {
      // 根据表单的数据总数来决定分页数据的总数
      this.paginations.total = this.allTableData.length
      // 初始一页显示的数据条数为 5
      this.paginations.page_size = 5
      // 初始分页数据为第一页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size
      })
      // console.log(this.tableData)
      // 当跳转到其他分页时执行 handleCurrentChange
      this.handleCurrentChange(this.paginations.page_index)
    },
    // 当选择项发生变化时会触发选择高亮操作
    handleSelectionChange(val) {
      this.selectionRow = val //保存已选择行
      this.multipleSelection = val
      // console.log(this.multipleSelection)
      if (this.multipleSelection.length > 1) {
        this.multipleSelectionFlag = true
      }
      if (this.multipleSelection.length === 0) {
        this.multipleSelectionFlag = false
      }
    },
    // 高亮选中行
    rowClick(row, column, event) {
      let refsTable = this.$refs.multipleTable // 获取表格对象
      let findRow = this.selectionRow.find(
        (item) => item.rowIndex === row.rowIndex
      )
      if (findRow) {
        refsTable.toggleRowSelection(row, false)
        return
      }
      refsTable.clearSelection()
      refsTable.toggleRowSelection(row) // 调用选中行方法
    },
    rowStyle({ row, rowIndex }) {
      Object.defineProperty(row, 'rowIndex', {
        //给每一行添加不可枚举属性rowIndex来标识当前行
        value: rowIndex,
        writable: true,
        enumerable: false,
      })
    },
    rowClassName({ row, rowIndex }) {
      let rowName = '',
        findRow = this.selectionRow.find((c) => c.rowIndex === row.rowIndex)
      if (findRow) {
        rowName = 'current-row ' // elementUI 默认高亮行的class类 不用再样式了^-^,也可通过css覆盖改变背景颜色
      }
      return rowName //也可以再加上其他类名 如果有需求的话
    },
    // 添加操作
    handleAdd() {
      this.dialog.show = true
      this.dialog = {
        show: true,
        title: '添加资金信息',
        option: 'add',
      }
      this.formData = {
        type: '',
        desc: '',
        income: '',
        expenses: '',
        cash: '',
        remark: '',
        _id: '',
      }
    },
    // 编辑操作
    handleEdit(index, row) {
      // 编辑弹出框
      this.dialog = {
        show: true,
        title: '修改资金信息',
        option: 'edit',
      }
      this.formData = {
        type: row.type,
        desc: row.desc,
        income: row.income,
        expenses: row.expenses,
        cash: row.cash,
        remark: row.remark,
        _id: row._id,
      }
    },
    // 删除操作
    handleDelete(index, row) {
      // 二次确认删除
      this.$confirm('确定要删除吗？', '提示', {
        type: 'warning',
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          this.$axios.delete(`/api/profiles/delete/${row._id}`).then((res) => {
            this.$message({
              message: '数据删除成功',
              type: 'success',
            })
            this.jumpRefresh()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 批量删除操作
    delAllSelection() {
      // 二次确认删除
      this.$confirm('确定要批量删除吗？', '提示', {
        type: 'warning',
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        let checkArr = this.multipleSelection // multipleSelection存储了勾选到的数据
        let params = []
        checkArr.forEach(function(item) {
          params.push(item._id) // 添加所有需要删除数据的id到一个数组，post提交过去
        })
        this.$axios
          .post('/api/profiles/multiDelete', params)
          .then((res) => {
            this.$message({
              message: '数据批量删除成功',
              type: 'success',
            })
            this.jumpRefresh()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      })
    },
    // 删除后自动跳转刷新
    jumpRefresh() {
      // totalPage 获取删除后的总页数，Math.ceil 返回大于或等于一个给定数字的最小整数
      // const totalPage = Math.ceil(
      //   (this.allTableData.length - 1) / this.paginations.page_size
      // )
      // // pageNum 获取删除后要跳转的页码 如果当前页码大于总页数，则删除后要跳转的页码为总页数
      // const pageNum =
      //   this.paginations.page_index > totalPage
      //     ? totalPage
      //     : this.paginations.page_index
      // // 删除后要跳转的页码只可以大于或等于 1
      // this.pageIndex = pageNum < 1 ? 1 : pageNum
      this.getFundList()
      this.handleCurrentChange(this.paginations.page_index)
      this.getFundList()
    },    
    // size 切换一页显示多少条的条数 例如 5 条切换为 10 条
    handleSizeChange(size) {
      this.paginations.page_index = 1
      this.paginations.page_size = size
      // 初始分页数据为第一页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < size
      })
    },
    // page 前往第几页的页数，即当前页
    handleCurrentChange(page) {
      // console.log(this.paginations.page_index)
      // 获取当前页（第 page 页）的第一条数据
      let index = this.paginations.page_size * (page - 1)
      // 获取当前页（第 page 页）最大条数
      let nums = this.paginations.page_size * page
      // 当前页的所有数据
      let tables = []
      for (let i = index; i < nums; i++) {
        // 如果 this.allTableData 有当前页的数据，则存放在 tables 里
        if (this.allTableData[i]) {
          tables.push(this.allTableData[i])
        }
      }
      this.tableData = tables
    },
    // 按时间筛选操作
    handleSearch() {
      if (!this.searchData.startTime || !this.searchData.endTime) {
        this.$message({
          type: 'warning',
          message: '请选择时间区间',
        })
        this.getFundList()
        return
      } else {
        // 获取开始时间（毫秒数）
        const sTime = this.searchData.startTime.getTime()
        // 获取结束时间（毫秒数）
        const eTime = this.searchData.endTime.getTime()
        // 过滤数据
        this.allTableData = this.filterTableData.filter((item) => {
          // 获取每条数据的毫秒数
          let date = new Date(item.date)
          let time = date.getTime()
          // 筛选出大于等于开始时间并小于等于结束时间的数据
          return time >= sTime && time <= eTime
        })
        this.setPagination()
      }
    },
    // 当开始时间为空时则刷新列表
    changeStart(val) {
      if (val === null) {
        val = ''
        this.getFundList()
      }
    },
    // 当结束时间为空时则刷新列表
    changeEnd(val) {
      if (val === null) {
        val = ''
        this.getFundList()
      }
    },      
    // 搜索描述
    searchItem() {
      // 如果没有输入内容则提示
      if (!this.search) {
        this.$message({
          type: 'warning',
          message: '请输入描述',
        })
        this.getFundList()
        return
      } else {
        this.allTableData = this.filterTableData.filter((data) =>
          data.desc.toLowerCase().includes(this.search.toLowerCase())
        )
        // 如果没有搜索到内容则提示
        if (this.allTableData.length === 0) {
          this.$message({
            type: 'warning',
            message: '没有搜索结果',
          })
          this.search = ''
          this.getFundList()
        }
        this.setPagination()
      }
    },
  },
  // 过滤日期格式
  filters: {
    showDate: function(value) {
      let date = new Date(value * 1000)
      return formatDate(value)
    },
  },
}
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.fundList-content {
  padding: 10px;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
.search {
  margin-left: 10px;
}
.ml10 {
  margin-left: 10px;
}
</style>
<style>
.btn-custom-cancel {
  float: right;
  margin-left: 10px;
}
</style>
