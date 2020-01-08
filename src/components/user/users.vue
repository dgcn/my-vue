<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>


        <el-card class="main-card">
            <el-row :gutter="10">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="params.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">

                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
            </el-row>


            <!--用户列表-->
            <el-table class="main-content" :data="userList" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userChangeStatus(scope.row)">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column lable="操作" width="180px">
                    <template slot-scope="scope">

                        <el-tooltip class="item" effect="dark" :enterable="false" content="编辑" placement="top">
                            <el-button type="primary" size="mini" icon="el-icon-edit"
                                       @click="showEditDialog(scope.row)"></el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" :enterable="false" content="删除" placement="top" >
                            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row)"></el-button>
                        </el-tooltip>

                        <el-tooltip class="item" effect="dark" :enterable="false" content="设置" placement="top">
                            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <el-pagination class="pagination"
                           @size-change="handleSizeChange"
                           @current-change="handleCurrentChange"
                           :current-page="params.pagenum"
                           :page-sizes="[1, 2, 4, 6]"
                           :page-size="params.pagesize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </el-card>

        <!--添加对话框-->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="dialogClose">

            <el-form :model="addUser" :rules="addUserRules" ref="addUserRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addUser.username"></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input v-model="addUser.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addUser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="addUser.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAddUser">确 定</el-button>
            </span>
        </el-dialog>


        <!--编辑对话框-->
        <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">

            <el-form :model="editUser" :rules="editUserRules" ref="editUserRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="editUser.username" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editUser.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                    <el-input v-model="editUser.mobile"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editAddUser">确 定</el-button>
            </span>
        </el-dialog>
    </div>


</template>
<script>
    export default {
        created() {
            this.getUserList()
        },
        data() {

            var checkEmail = (rule, value, callback) => {
                const regEmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

                if (regEmail.test(value)) {
                    return callback();
                }
                callback(new Error('请输入合法的邮箱'))
            }

            var checkMobile = (rule, value, callback) => {

                const regMobile = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/
                if (regMobile.test(value)) {
                    return callback();
                }
                callback(new Error('请输入合法的手机号码'))
            }
            return {
                userList: [],
                total: 0,
                params: {
                    query: '',
                    pagenum: 1,
                    pagesize: 2
                },
                addDialogVisible: false,
                editDialogVisible: false,
                addUser: {
                    username: '',
                    password: '',
                    email: '',
                    mobile: ''
                },
                addUserRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],

                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                },
                editUser: {

                },
                editUserRules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],

                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'},
                        {validator: checkEmail, trigger: 'blur'}
                    ],
                    mobile: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                        {validator: checkMobile, trigger: 'blur'}
                    ]
                }

            }
        },

        methods: {
            async getUserList() {
                const {data: res} = await this.$http.get('users', {params: this.params})
                if (res.meta.status !== 200) return this.$message.error('获取失败')
                this.userList = res.data.users
                this.total = res.data.total
            },
            handleSizeChange(newSize) {
                this.params.pagesize = newSize
                this.getUserList()
            },
            handleCurrentChange(newPage) {

                this.params.pagenum = newPage
                this.getUserList()

            },
            async userChangeStatus(user) {
                const {data: res} = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)

                if (res.meta.status !== 200) {
                    user.mg_state = !user.mg_state
                    this.$message.error('操作失败');
                }
                this.$message.success('操作成功')
            },
            dialogClose() {
                this.$refs.addUserRef.resetFields()
            },
            doAddUser() {
                this.$refs.addUserRef.validate(async valid => {
                    if (!valid) {
                        return
                    }

                    const {data: res} = await this.$http.post('users', this.addUser)
console.log(res)
                    if (res.meta.status != 201) {
                        return this.$message.error('操作失败')
                    }

                    // this.$message.success('操作成功');
                    //
                    // this.addDialogVisible = false;
                    //
                    // this.getUserList()
                })
            },
            editDialogClose() {
                this.$refs.editUserRef.resetFields();
                this.editDialogVisible = false
            },
            editAddUser() {
                this.$refs.editUserRef.validate(async valide => {
                    if (!valide) {
                        return
                    }

                    const {data: res} = await this.$http.put('users/'+this.editUser.id,{
                        email: this.editUser.email,
                        mobile: this.editUser.mobile
                    });

                    if(res.meta.status !== 200){
                        return this.$message.error('操作失败')
                    }

                    this.editDialogVisible = false
                    this.getUserList()
                    this.$message.success('操作成功')


                })

            },
            async showEditDialog(users) {
                const {data: res} = await this.$http.get('users/' + users.id)

                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }

                this.editUser = res.data;
                this.editDialogVisible = true;

            },
            async removeUser(users){
                const confirmRes = await this.$confirm('确定删除该文件吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch((err)=>{
                    return err
                })

                if(confirmRes != 'confirm'){
                    return this.$message.info('已取消删除');
                }

                const {data: res} = await this.$http.delete('users/'+users.id)

                if(res.meta.status !== 200){
                    return this.$message.error('操作失败')
                }

                this.$message.success('操作成功');
                this.getUserList()
            }
        }
    }
</script>
<style lang="less" scoped>

</style>