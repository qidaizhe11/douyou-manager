<template>
  <div class="main-container">
    <div class="header">编辑/添加规则</div>
    <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px" label-position="left">
        <el-form-item label="匹配类型" class="form-item-type">
          <el-select v-model="form.type">
            <el-option label="关键词匹配" value="keyword"></el-option>
            <el-option label="精确匹配" value="fullword"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <div class="keyword-container">
            <template v-for="keyword in form.keywords">
              <el-tag :closable="true">{{keyword}}</el-tag>
            </template>
            <el-input placeholder="请输入关键词" v-model="form.inputKeyword" @blur="onKeywordBlur">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}"
                    placeholder="请输入回复内容" v-model="form.replyContent">
          </el-input>
        </el-form-item>
        <el-form-item label-width="0">
          <div class="bottom-buttons-container">
            <el-button type="primary">确定</el-button>
            <el-button>取消</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import { Form, FormItem, Select, Option, Tag, Input } from 'element-ui'

  Vue.use(Form)
  Vue.use(FormItem)
  Vue.use(Select)
  Vue.use(Option)
  Vue.use(Tag)
  Vue.use(Input)

  export default {
    data() {
      return {
        form: {
          type: 'keyword',
          keywords: [],
          inputKeyword: '',
          replyContent: ''
        }
      }
    },
    methods: {
      onKeywordBlur(e) {
        const value = e.target.value
        if (value) {
          this.form.keywords.push(value)
          this.form.inputKeyword = ''
        }
      }
    }
  }
</script>

<style lang="scss">
  .main-container {
    padding: 20px 20px;

    .header {
      font-size: 24px;
    }

    .form-container {
      padding: 30px 50px 20px 0;

      .el-form {
        min-width: 500px;

        .form-item-type {
          .el-select {
            width: 100%;
          }
        }

        .keyword-container {
          width: 100%;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          .el-tag {
            font-size: 14px;
            /*margin-right: 5px;*/
            margin: 5px 5px 5px 0;
          }

          .el-input {
            width: 300px;
          }
        }

        .bottom-buttons-container {
          width: 100%;
          padding: 10px 0;
          display: flex;
          justify-content: stretch;

          .el-button {
            flex: 1;
          }
        }

        .fa-icon {
          color: gray;
          $icon-size: 28px;
          width: $icon-size;
          height: $icon-size;
          line-height: $icon-size;
        }
      }
    }
  }
</style>
