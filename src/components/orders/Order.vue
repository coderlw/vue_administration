<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @click="getOrderData">
            <el-button slot="append" icon="el-icon-search" @click="getOrderData"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderTableList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" size="mini" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <el-button type='primary' icon="el-icon-edit" size="mini" @click="adressDialog">地址</el-button>
            <el-button type="warning" icon="el-icon-location" size="mini" @click="progressDialog">物流</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1, 3, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <el-dialog title="收货地址" :visible.sync="addressDialogVisible" @close="adressClose">
        <el-form :model="addressForm" :rules="adressFormRules" ref="adressFormRef">
          <el-form-item label="省市区/县" prop="adress">
            <el-cascader v-model="addressForm.adress" :options="citydata" expandTrigger="hover"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAdress">
            <el-input v-model="addressForm.detailAdress"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addressDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addressDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="物流信息" :visible.sync="progressFormVisible">
        <span>物流信息</span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import citydata from './citydata'

export default {
  name: '',
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      orderTableList: [],
      total: 0,
      addressDialogVisible: false,
      addressForm: {
        adress: '',
        detailAdress: '',
      },
      adressFormRules: {
        adress: [
          { required: true, message: '请输入城市', trigger: 'blur' }
        ],
        detailAdress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      citydata,
      progressFormVisible: false,
      progressInfo: {}
    }
  },
  methods: {
    async getOrderData() {
      console.log(this.queryInfo.query);
      const { data: res } = await this.$axios.get('orders', { params: this.queryInfo });
      if (res.meta.status !== 200) return this.$message.error('查询订单数据失败');
      this.orderTableList = res.data.goods;
      this.total = res.data.total;
      console.log(res);
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderData();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getOrderData();
    },
    adressDialog() {
      this.addressDialogVisible = true;
    },
    adressClose() {
      this.$refs.adressFormRef.resetFields();
    },
    async progressDialog() {
      /*   const { data: res } = await this.$axios.get('kuaidi/1106975712662');
        console.log(res);
        if (res.meta.status !== 200) return this.$message.error('获取物流数据失败');
        this.progressInfo = res.data; */
      this.progressFormVisible = true;
    }
  },
  created() {
    this.getOrderData();
  }
};
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>