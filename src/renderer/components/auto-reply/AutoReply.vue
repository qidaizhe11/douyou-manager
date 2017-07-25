<template>
  <div class="container">
    <LeftSideBar />
    <div class="main-container">
      <div class="header">回复规则</div>
      <div class="table-container">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="匹配内容" width="250">
            <template scope="scope">
              <template v-if="scope.row.type === 'keyword'">
                <div class="keyword-cell">
                  <template v-for="keyword in scope.row.keywords">
                    <el-tag class="keyword-tag">{{keyword}}</el-tag>
                  </template>
                </div>
              </template>
              <template v-else-if="scope.row.type === 'fulltext'">
                {{scope.row.text}}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="105">
            <template scope="scope">
              <template v-if="scope.row.type === 'keyword'">
                关键词匹配
              </template>
              <template v-else-if="scope.row.type === 'fulltext'">
                精确匹配
              </template>
            </template>
          </el-table-column>
          <!--<el-table-column prop="date" label="日期" width="150"></el-table-column>-->
          <!--<el-table-column prop="name" label="姓名" width="180"></el-table-column>-->
          <el-table-column prop="address" label="自动回复"></el-table-column>
          <el-table-column label="操作" width="80">
            <template scope="scope">
              <el-button type="text" size="small">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination
            :page-sizes="[10,20,30, 50]"
            :page-size="20"
            layout="total, sizes, prev, pager, next, jumper"
            :total="120">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import Vue from 'vue'
  import { Table, TableColumn, Button, Tag, Pagination } from 'element-ui'
  import LeftSideBar from 'components/LeftSideBar'

  Vue.use(Table)
  Vue.use(TableColumn)
  Vue.use(Button)
  Vue.use(Tag)
  Vue.use(Pagination)

  export default {
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          type: 'keyword',
          keywords: ['约吗', '约么', '约否', '可约哈哈哈恶化过分啊就给啊就']
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
          type: 'keyword',
          keywords: ['hi', 'hello', '哈喽', '嗨']
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          type: 'fulltext',
          text: 'hello, 姑娘'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
          type: 'keyword',
          keywords: ['胸好大', '胸大', '胸真大']
        }]
      }
    },
    components: {
      LeftSideBar
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .main-container {
    flex: 1;

    padding: 20px 20px;

    .header {
      font-size: 24px;
    }

    .table-container {
      padding: 20px 0 10px 0;
    }

    .pagination-container {
      padding: 20px 0 0 0;
    }
  }

  .keyword-cell {
    /*padding: 5px 0;*/
    padding-bottom: 5px;

    .keyword-tag {
      margin: 5px 5px 0 0;
      /*margin-right: 5px;*/
      font-size: 14px;
    }
  }

</style>
