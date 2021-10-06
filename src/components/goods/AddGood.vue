<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center :closable="false" show-icon>
      </el-alert>
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="商品完成"></el-step>
      </el-steps>
      <el-form :model="goodForm" :rules="goodRules" ref="goodRef" label-position="top">
        <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabItemClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="goodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="goodForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="goodForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="goodForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="goodForm.goods_cat" :options="cateData" :props="cateProp" expandTrigger="hover"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item1 in manyTableData" :label="item1.attr_name" :key="item1.attr_id">
              <el-checkbox-group v-model="item1.attr_vals">
                <el-checkbox v-for="(item2, index) in item1.attr_vals" :key="index" :label="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyTableData" :label="item.attr_name" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload :action="picsURL" :headers="headersObj" :on-success="handlePics" :on-preview="handlePreview" :on-remove="handleRemove" list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="goodForm.goods_introduce"></quill-editor>
            <el-button type="primary" size="mini" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
        <img :src="urlPic" alt="">
      </el-dialog>
      <!-- <el-button style="margin-right: 30px" @click="next" align-center>下一步</el-button> -->
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: '',
  data() {
    return {
      activeIndex: '0',
      goodForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      goodRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      cateData: [],
      cateProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyTableData: [],
      onlyTableData: [],
      picsURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headersObj: { Authorization: window.sessionStorage.getItem('token') },
      urlPic: '',
      imgDialogVisible: false
    }
  },
  computed: {
    cateId() {
      if (this.goodForm.goods_cat.length === 3) {
        return this.goodForm.goods_cat[this.goodForm.goods_cat.length - 1];
      } else {
        return null;
      }
    }
  },
  methods: {
    async getCateDate() {
      const { data: res } = await this.$axios.get('categories');
      if (res.meta.status !== 200) return this.$message.error('获取分类数据失败');
      this.cateData = res.data;
    },
    beforeTabLeave(newActiveName, oldActiveName) {
      if (oldActiveName === '0' && this.goodForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类');
        return false;
      }
    },
    async tabItemClick() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } });
        if (res.meta.status !== 200) return this.$message.error('获取参数失败');
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        });
        this.manyTableData = res.data;
        console.log(this.manyTableData);
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } });
        if (res.meta.status !== 200) return this.$message.error('获取参数失败');
        this.onlyTableData = res.data;

      }
    },
    handlePics(response) {
      console.log(response);
      const picInfo = { pic: response.data.tmp_path };
      this.goodForm.pics.push(picInfo);
      console.log(this.goodForm);
    },
    handleRemove(file) {
      console.log(file);
      const filePath = file.response.data.tmp_path;
      const i = this.goodForm.pics.findIndex(x => {
        x.pics === filePath;
      });
      this.goodForm.pics.splice(i, 1);
      console.log(this.goodForm);
    },
    handlePreview(file) {
      console.log(file);
      this.urlPic = file.response.data.url;
      this.imgDialogVisible = true;
    },
    addGood() {
      this.$ref.goodref.validate(async valid => {
        if (!valid) return this.$message.error('请填写商品的必填项');
        // 深拷贝对象
        const form = _.cloneDeep(this.goodForm)
        form.goods_cat = form.goods_cat.join(',');
        this.manyTableData.forEach(item => {
          const info = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') };
          this.goodForm.attrs.push(info);
        })
        this.onlyTableData.forEach(item => {
          const info = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.goodForm.attrs.push(info);
        })
        form.attrs = this.goodForm.attrs;
        const { data: res } = await this.$axios.post('goods', form);
        console.log(res);
        if (res.meta.status !== 201) return this.$message.error('添加商品失败');
        this.$message.success('添加商品成功');
        this.$router.push('/goods');
      })
    }
  },
  created() {
    this.getCateDate();
  }
};
</script>

<style scoped>
.el-checkbox {
  margin: 10px;
}
img {
  width: 100%;
}
/* .quill-editor {
  height: 250px;
} */
.el-button {
  margin-top: 15px;
}
</style>