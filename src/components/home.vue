<template>
    <el-container>
        <el-header>
            <div>
                <img src="../assets/images/logo.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container >
            <el-aside  :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">||||</div>
                <el-menu unique-opened router :collapse="isCollapse" :collapse-transition="false"	 background-color="#333744" text-color="#fff" active-text-color="#409fff"  :default-active="activePath">
                    <!--一级菜单-->
                    <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                        <template slot="title">
                            <i :class="icons[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!--二级菜单-->
                        <el-menu-item :index="'/'+subMenu.path" v-for="subMenu in item.children" :key="subMenu.id+''" @click="savePath('/'+subMenu.path)" >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subMenu.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>
                </el-menu>

            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
    export default {
        created() {
            this.getMenuList();
            this.activePath = window.sessionStorage.getItem('activePath');
        },
        data() {
            return {
                menulist: [],
                icons: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-lock_fill',
                    '102': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '145': 'iconfont icon-danju'
                },
                isCollapse: false,
                activePath: ''
            }
        },
        methods: {
            logout() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            async getMenuList() {
                const {data: res} = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error('获取数据失败');
                this.menulist = res.data;
            },
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            savePath(activePath){
                window.sessionStorage.setItem('activePath', activePath)
                console.log(activePath)
                this.activePath = activePath;
            }
        }
    }
</script>
<style lang="less" scoped>

    .el-container {
        height: 100%;
    }

    .el-header {
        background-color: #373d41;
        height: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        color: #fff;
        font-size: 20px;

        > div {
            display: flex;
            align-items: center;

            span {
                margin-left: 10px;
            }
        }
    }

    .el-aside {
        background-color: #333744;
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .el-menu {
        border: none;
    }

    .toggle-button {
        background-color: #4A5064;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        letter-spacing: 0.2rem;
        text-align: center;
        cursor: pointer;
    }
</style>