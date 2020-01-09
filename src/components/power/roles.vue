<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>

            <el-table :data="rolesList" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', index1 ===0 ? 'bdtop' : '', 'vcenter']"
                                v-for="(item1, index1) in scope.row.children" :key="item1.id">
                            <el-col :span="5">
                                <el-tag closable @close="removeRole(scope.row, item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="19">
                                <el-row :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                                        v-for="(item2, index2) in item1.children" :key="item2.id">
                                    <el-col :span="5">
                                        <el-tag type="success" closable @close="removeRole(scope.row, item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="19">
                                        <el-tag type="warning" v-for="(item3, index3) in item2.children" :key="item3.id"
                                                closable @close="removeRole(scope.row, item3.id)">{{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>

                    </template>
                </el-table-column>
                <el-table-column type="index">#</el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="320px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>

                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>

                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showPower(scope.row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog title="分配权限" :visible.sync="powerDialogVisible" width="50%" @close="closeDialog" ref="rightsRef">
            <el-tree :data="roleTypeList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                     :default-checked-keys="defKey"></el-tree>
            <span slot="footer" class="dialog-footer">
    <el-button @click="powerDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="doRight">确 定</el-button>
  </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                rolesList: [],
                powerDialogVisible: false,
                roleTypeList: [],
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                defKey: [],
                roleId: ''

            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() {
                const {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取失败')
                }

                this.rolesList = res.data

            },
            async removeRole(role, rightId) {
                var confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch((err) => {
                    return err
                })

                if (confirmResult != 'confirm') {
                    return this.$message.info('取消了删除')
                }

                const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    this.$message.error('操作失败')
                }

                this.$message.success('操作成功')
                // this.getRolesList()
                role.children = res.data;
            },
            async showPower(role) {

                this.roleId = role.id

                const {data: res} = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    this.$message.error('操作失败')
                }

                this.roleTypeList = res.data

                this.getAllKey(role, this.defKey)

                this.powerDialogVisible = true
            },

            getAllKey(node, arr) {
                if (!node.children) {
                    return arr.push(node.id)
                }

                node.children.forEach(item =>
                    this.getAllKey(item, arr)
                )
            },
            closeDialog() {
                this.defKey = []
            },
            async doRight() {
                const keys = [
                    ...this.$refs.rightsRef.getCheckedKeys(),
                    ...this.$refs.rightsRef.getHalfCheckedKeys()
                ]

                const idStr = keys.join(',')

                const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, {
                    rids: idStr
                })

                if(res.meta.status !== 200){
                    return this.$message.error('操作失败')
                }

                this.$message.success('操作成功')
                this.getRolesList()
                powerDialogVisible = false

            }
        }


    }</script>
<style lang="less" scoped>

    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }
</style>