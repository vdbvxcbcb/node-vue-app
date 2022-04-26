<template>
  <div>
    <div :id="id" :style="{ width: width, height: height }"></div>
  </div>
</template>

<script>
let echarts = require('echarts/lib/echarts')
// 引入需要使用的图表类型，标题，提示信息等
require('echarts/lib/chart/bar') 
require('echarts/lib/component/legend') 
require('echarts/lib/component/title') 

export default {
  name: 'barEchart',
  props: {
    id: {
      type: String,
      default: 'myChart',
    },
    width: {
      type: String,
      default: '100%',
    },
    height: {
      type: String,
      default: '100%',
    },
  },
  data() {
    return {
      chart: null,
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        title: {
          text: '最近一周销售统计',
          left: 'center',
          top: 2,
          textStyle: {
            fontSize: 20,
          },
        },
        color: ['#4A90E2', '#F5A623', '#FF5858', '#64D572'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true,
        },
        legend: {
          left: 'center',
          bottom: '2%',
          data: ['可口可乐', '爆米花', '薯片'],
        },
        xAxis: [
          {
            type: 'category',
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            axisTick: {
              alignWithLabel: true,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
        series: [
          {
            name: '可口可乐',
            type: 'bar',
            data: [10, 52, 200, 334, 390, 330, 220],
            itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#4A90E2',
										fontSize: 12
									}
								}
							}
						},
          },
          {
            name: '爆米花',
            type: 'bar',
            data: [10, 52, 200, 334, 390, 330, 220],
            itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#F5A623',
										fontSize: 12
									}
								}
							}
						},
          },
          {
            name: '薯片',
            type: 'bar',
            data: [10, 52, 200, 334, 390, 330, 220],
            itemStyle: {
							normal: {
								label: {
									show: true, //开启显示
									position: 'top', //在上方显示
									textStyle: { //数值样式
										color: '#FF5858',
										fontSize: 12
									}
								}
							}
						},
          }          
        ],
      })
    },
  },
}
</script>

<style scoped></style>
