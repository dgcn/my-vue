<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="警告提示的文案" type="warning" show-icon>
            </el-alert>

            <el-row class="cat_opt">
                <el-col>
                    <span>选择商品分类：</span>
                    <span>
                        <el-cascader expand-trigger="hover" :options="cateList" :props="cateProps"
                                     v-model="selectCateKeys" @change="hangeChange" clearable>

                    </el-cascader>
                    </span>
                </el-col>
            </el-row>


            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="用户管理" name="many">
                    <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">
                        添加参数
                    </el-button>

                    <el-table :data="manyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                        @close="deleteDetail(i, scope.row)">{{item}}
                                </el-tag>

                                <el-input v-if="scope.row.inputVisible"
                                          class="input-new-tag"
                                          v-model="scope.row.inputValue"
                                          ref="saveTagInput"
                                          size="small"
                                          @keyup.enter.native="handleInputConfirm(scope.row)"
                                          @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index">#</el-table-column>
                        <el-table-column :label="titleText" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="showDialog(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="removeParam(scope.row.attr_id)">
                                    删除
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>

                <el-tab-pane label="配置管理" name="only">
                    <el-button :disabled="isBtnDisabled" type="primary" size="mini" @click="addDialogVisible=true">
                        静态属性
                    </el-button>
                    <el-table :data="onlyTableData" border stripe>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag v-for="(item, i) in scope.row.attr_vals" :key="i" closable
                                        @close="deleteDetail(i, scope.row)">{{item}}
                                </el-tag>
                                <el-input v-if="scope.row.inputVisible"
                                          class="input-new-tag"
                                          v-model="scope.row.inputValue"
                                          ref="saveTagInput"
                                          size="small"
                                          @keyup.enter.native="handleInputConfirm(scope.row)"
                                          @blur="handleInputConfirm(scope.row)">
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+
                                    New Tag
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index">#</el-table-column>
                        <el-table-column :label="titleText" prop="attr_name"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini"
                                           @click="showDialog(scope.row.attr_id)">编辑
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini"
                                           @click="removeParam(scope.row.attr_id)">
                                    删除
                                </el-button>

                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!--添加对话框-->
        <el-dialog :title="titleText" :visible.sync="addDialogVisible" width="50%" @close="closeDialog">
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRule" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑框-->
        <el-dialog title="编辑" :visible.sync="editDialogVisible" width="50%" @close="closeEditDialog">
            <el-form ref="editFormRef" :model="editForm" :rules="editFormRule" label-width="100px">
                <el-form-item :label="titleText" prop="attr_name">
                    <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                cateList: [],
                cateProps: {
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                },
                selectCateKeys: [],
                activeName: 'many',
                manyTableData: [],
                onlyTableData: [],
                addDialogVisible: false,
                addForm: {
                    attr_name: ''
                },
                addFormRule: {
                    attr_name: [
                        {required: true, message: '必填项不为空', trigger: 'blur'}
                    ]
                },
                editDialogVisible: false,
                editForm: {
                    attr_id: '',
                    attr_name: ''
                },
                editFormRule: {},
                inputValue: ''

            }
        },
        created() {
            this.getCateList()
        },
        methods: {
            async getCateList() {
                const {data: res} = await this.$http.get('categories')

                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }

                this.cateList = res.data
            },
            hangeChange() {
                this.getParamsData()
            },
            handleClick() {
                this.getParamsData()
            },
            async getParamsData() {
                if (this.selectCateKeys.length != 3) {
                    this.selectCateKeys = []
                    this.manyTableData =[]
                    this.onlyTableData =[]
                    return
                }

                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {
                    params: {sel: this.activeName}
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }

                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
                    item.inputVisible = false
                    item.inputValue = ''
                })

                if (this.activeName == 'many') {
                    this.manyTableData = res.data
                } else {
                    this.onlyTableData = res.data
                }
            },
            closeDialog() {
                this.$refs.addFormRef.resetFields()
            },
            addParams() {
                this.$refs.addFormRef.validate(async valide => {
                    if (!valide) return

                    const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {
                        attr_name: this.addForm.attr_name,
                        attr_sel: this.activeName
                    })

                    if (res.meta.status != 201) {
                        return this.$message.error('操作失败')
                    }

                    this.$message.success('操作成功')
                    this.addDialogVisible = false
                    this.getParamsData()

                })
            },
            async showDialog(attr_id) {
                const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {params: {attr_sel: this.activeName}})
                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }
                this.editForm = res.data
                this.editDialogVisible = true
            },
            editParams() {
                this.$refs.editFormRef.validate(async valid => {

                    if (!valid) return
                    console.log(this.editForm)
                    const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                        attr_name: this.editForm.attr_name,
                        attr_sel: this.editForm.attr_sel
                    })
                    console.log(res)
                    if (res.meta.status !== 200) {
                        return this.$message.error('操作失败')
                    }

                    this.$message.success('操作成功')
                    this.getParamsData()
                    this.editDialogVisible = false

                })

            },
            closeEditDialog() {
                this.$refs.editFormRef.resetFields()
                this.editDialogVisible = false
            },
            async removeParam(attr_id) {
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch((err) => {
                    return err
                });

                if (confirmResult !== 'confirm') {
                    return this.$message.info('已取消删除')
                }

                const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除失败')
                }

                this.$message.success('删除成功')
                this.getParamsData()
            },
            async handleInputConfirm(row) {
                if (row.inputValue.trim().length === 0) {
                    row.inputValue = ''
                    row.inputVisible = false
                    return
                }
                row.attr_vals.push(row.inputValue.trim())
                row.inputValue = ''
                row.inputVisible = false
                this.saveAttrVals(row)

            },
            showInput(row) {
                row.inputVisible = true
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            async deleteDetail(i, row) {
                row.attr_vals.splice(i, 1)
                this.saveAttrVals(row)
            },
            async saveAttrVals(row) {
                const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(',')
                })
                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }
                this.$message.success('操作成功')
            }
        },
        computed: {
            isBtnDisabled() {
                if (this.selectCateKeys.length !== 3) {
                    return true
                }
                return false
            },
            cateId() {
                if (this.selectCateKeys.length === 3) {
                    return this.selectCateKeys[2]
                }

                return null
            },
            titleText() {
                if (this.activeName === 'many') {
                    return '动态参数'
                }

                return '静态属性'
            }
        }
    }
</script>
<style lang="less" scoped>
    .cat_opt {
        margin-top: 20px;
    }

    .input-new-tag {
        width: 120px;
    }

    .el-tag {
        margin: 5px;
    }

</style>