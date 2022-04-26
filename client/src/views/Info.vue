<template>
  <div class="info">
   <el-row :gutter="20">
     <el-col :span="8">
         <el-card shadow="hover" class="mgb20" style="height:252px;">
             <div class="user-info">
                 <img :src="avatar" class="user-avatar" alt />
                 <div class="user-info-container">
                   <div class="placeholder no-content">
                   </div>
                   <div class="user-info-cont">
                     <div class="user-info-name">{{user}}</div>
                     <div>{{role}}</div>
                   </div>
                   <el-upload
                     class="upload"
                     :action="uploadUrl + id"
                     :on-success="uploadImg"
                     :before-upload="beforeImgUpload"
                     :show-file-list="false"
                     multiple>
                     <el-button size="small" type="primary"><i class="el-icon-upload"></i> 更换头像</el-button>
                   </el-upload>  
                 </div>
             </div>
             <div class="user-info-list">
                 上次登录时间：
                 <span>2020-01-01</span>
             </div>
             <div class="user-info-list">
                 上次登录地点：
                 <span>广州</span>
             </div>
         </el-card>
         <el-card shadow="hover" style="height:252px;">
             <div slot="header" class="clearfix">
                 <span>语言详情</span>
             </div>Vue
             <el-progress :percentage="71.3" color="#42b983"></el-progress>JavaScript
             <el-progress :percentage="24.1" color="#f1e05a"></el-progress>CSS
             <el-progress :percentage="13.7"></el-progress>HTML
             <el-progress :percentage="5.9" color="#f56c6c"></el-progress>
         </el-card>
     </el-col>
     <el-col :span="16">
         <el-row :gutter="20" class="mgb20">
             <el-col :span="8">
                 <el-card shadow="hover" :body-style="{padding: '0px'}">
                     <div class="grid-content grid-con-1">
                         <i class="el-icon-user grid-con-icon"></i>
                         <div class="grid-cont-right">
                             <div class="grid-num">1234</div>
                             <div>用户访问量</div>
                         </div>
                     </div>
                 </el-card>
             </el-col>
             <el-col :span="8">
                 <el-card shadow="hover" :body-style="{padding: '0px'}">
                     <div class="grid-content grid-con-2">
                         <i class="el-icon-bell grid-con-icon"></i>
                         <div class="grid-cont-right">
                             <div class="grid-num">321</div>
                             <div>系统消息</div>
                         </div>
                     </div>
                 </el-card>
             </el-col>
             <el-col :span="8">
                 <el-card shadow="hover" :body-style="{padding: '0px'}">
                     <div class="grid-content grid-con-3">
                         <i class="el-icon-goods grid-con-icon"></i>
                         <div class="grid-cont-right">
                             <div class="grid-num">5000</div>
                             <div>数量</div>
                         </div>
                     </div>
                 </el-card>
             </el-col>
        </el-row>     
        <el-row :gutter="20" class="mgb20">
          <el-col :span="24">
            <el-card shadow="hover">
              <bar-echart id="barEcharts" height="365px" ref="echarts"></bar-echart>
            </el-card>
          </el-col>
        </el-row>
      </el-col>       
    </el-row>
  </div>
</template>

<script>
  import BarEchart from '../components/ECharts/barEchart'
  export default {
    name: 'info',
    components: {
      BarEchart
    },
    data() {
      return {
        uploadUrl: 'http://localhost:5001/api/users/updateAvatar/'
      }
    },
    computed: {
      avatar() {
        return this.$store.getters.user.avatar
      },
      user() {
        return this.$store.getters.user.identity === 'manager' ? 'admin' : 'staff'
      },
      role() {
        return this.$store.getters.user.identity === 'manager' ? '管理员' : '普通员工'
      },
      id() {
        return this.$store.getters.user.id
      }
    },
    mounted () {
      this.selfAdaption()
    },
    methods: {
      uploadImg(res, file) {
        // console.log(res)
        // console.log(file)
        this.$store.getters.user.avatar = res.url
        this.$message({type: 'success', message: '更换头像成功'})  
      },      
      beforeImgUpload(file) {
        const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png') || (file.type === 'image/gif');
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isRightType) {
            this.$message.error('上传头像图片只能是 JPG/PNG/GIF 格式!');
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isRightType && isLt2M;
      },
      // echart自适应
      selfAdaption () {
        let that = this
        setTimeout(() => {
          window.onresize = function () {
            if (that.$refs.echarts) {
              that.$refs.echarts.chart.resize()
            }
          }
        }, 10)
      }
    }
  }
</script>

<style scoped>
.user-info-container {
  display: flex;
  height: 120px;
  justify-content: space-between;
  flex-direction: column;
  padding-left: 50px;
}
.info {
  width: 100%;
  height: 100%;
  background-color: #eee; 
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
}
.el-row {
    margin-bottom: 20px;
}

.grid-content {
    display: flex;
    align-items: center;
    height: 100px;
}

.grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 14px;
    color: #999;
}

.grid-num {
    font-size: 30px;
    font-weight: bold;
}

.grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
}
.grid-num {
  margin-bottom: 5px;
}
.grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
}

.grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
}

.user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
}

.user-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
}

.user-info-cont {
    font-size: 16px solid;
    color: #999;
}

.user-info-cont div:first-child {
    font-size: 26px;
    margin-bottom: 5px;
    color: #222;
}

.user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
}

.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}
</style>
