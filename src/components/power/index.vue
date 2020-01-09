<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
            <el-breadcrumb-item>活动列表</el-breadcrumb-item>
            <el-breadcrumb-item>活动详情</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card>
            <el-table :data="rightsList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="权限名称" prop="authName"></el-table-column>
                <el-table-column label="路径" prop="path"></el-table-column>
                <el-table-column label="权限等级">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.level === '0'">一级</el-tag>
                        <el-tag type="success" v-else-if="scope.row.level === '2'">二级</el-tag>
                        <el-tag type="warning" v-else>三级</el-tag>
                    </template>
                </el-table-column>

            </el-table>
            <!--分配角色-->
            <el-dialog
                    title="分配角色"
                    :visible.sync="setRoleDialogVisible"
                    width="30%">
                <span>这是一段信息</span>
                <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRoleDialogVisible = false">确 定</el-button>
  </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                rightsList: [],
                total: 0,
                pageSize: 2,
                pagePage: 1,
            }
        },
        created() {
            this.getRightList()
        },
        methods: {
            async getRightList() {
                const {data: res} = await this.$http.get('rights/list')
                console.log(res)
                if (res.meta.status !== 200) {
                    return this.$message.error('操作失败')
                }
                this.rightsList = res.data
            },
            handleSizeChange() {

            },
            handleCurrentChange() {

            }
        }
    }
</script>
<style lang="less" scoped>


</style>