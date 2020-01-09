<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary" @click="cateView">添加分类</el-button>
                </el-col>
            </el-row>

            <!--表格-->
            <tree-table class="tree-table" :data="cateList" :columns="columns" :selection-type="false"
                        :expand-type="false" index-text="#" show-index border :show-row-hover="false">
                <template slot="isOk" slot-scope="scope">

                    <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: green"></i>
                    <i class="el-icon-error" style="color:red" v-else></i>
                </template>
                <template slot="order" slot-scope="scope">
                    <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                    <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
                    <el-tag size="mini" type="warning" v-else>三级</el-tag>

                </template>

                <template slot="action" slot-scope="scope">
                    <el-button type="primary" size="mini">编辑</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>

            </tree-table>

            <!--分页-->
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="queryParams.pagenum"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="queryParams.pagesize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
            </el-pagination>
        </el-card>

        <!--分类框-->

        <el-dialog
                title="添加分类"
                :visible.sync="addDialogVisible"
                width="50%" @close="closeDialog">

            <el-form :model="addCateForm" :rules="addCateRule" ref="addCateRef" label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="分类名称：" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>

                <el-form-item label="父级分类：">

                    <el-cascader expand-trigger="hover" v-model="selectKeys" :options="parentCateList"
                                 :props="cascaderProps" @change="parentHandleChange" clearable
                                 change-on-select></el-cascader>

                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                cateList: [],
                total: 0,
                queryParams: {
                    type: 3,
                    pagenum: 1,
                    pagesize: 10
                },
                columns: [
                    {
                        label: '分类名称',
                        prop: 'cat_name'
                    },
                    {
                        lable: '是否有效',
                        type: 'template',
                        template: 'isOk'
                    },
                    {
                        lable: '排序',
                        type: 'template',
                        template: 'order'
                    },
                    {
                        lable: '操作',
                        type: 'template',
                        template: 'action'
                    }
                ],
                addDialogVisible: false,
                addCateForm: {
                    cat_name: '',
                    cat_pid: 0,
                    cat_level: 0
                },
                addCateRule: {
                    cat_name: [
                        {required: true, message: '必填项不为空', trigger: 'blur'}
                    ]
                },
                parentCateList: [],
                cascaderProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children',
                },
                selectKeys: []
            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            cateView() {
                this.getParentCateList()
                this.addDialogVisible = true

            },
            async getCateList() {
                const {data: res} = await this.$http.get('categories', {params: this.queryParams})

                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }
                this.cateList = res.data.result
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.queryParams.pagesize = newSize
                this.getCateList()
            },
            handleCurrentChange(newPage) {
                this.queryParams.pagenum = newPage
                this.getCateList()
            },
            async getParentCateList() {
                const {data: res} = await this.$http.get('categories', {
                    params: {type: 2}
                })

                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }
                this.parentCateList = res.data
            },
            async parentHandleChange() {
                if (this.selectKeys > 0) {
                    this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]

                    this.addCateForm.cat_level = this.selectKeys.length

                    return
                } else {
                    this.addCateForm.cat_pid = 0
                    this.addCateForm.cat_level = 0
                }

            },
            addCate() {

                this.$refs.addCateRef.validate(async valid => {

                    if (!valid) return

                    const {data: res} = await this.$http.post('categories', this.addCateForm)
console.log(res)
                    if (res.meta.status !== 201) {
                        return this.$message.error('操作失败')
                    }

                    this.$message.success('操作成功')
                    this.getCateList()
                    this.addDialogVisible = false

                })
            },
            closeDialog() {
                this.$refs.addCateRef.resetFields()
                this.selectKeys = []
                this.addCateForm.cat_level = ''
                this.addCateForm.cat_pid = ''
            }
        }
    }
</script>
<style lang="less" scoped>

    .el-cascader {
        width: 100%;
    }

    .tree-table {
        margin-top: 15px;
    }
</style>