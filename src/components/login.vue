<template>
	<div class="login">
		<div class="login_box">
				<div class="avator">
					<img src="../assets/logo.png">
				</div>
			<el-form :rules="loginRule" :model="form" ref="loginRef" class="login-form">
				<el-form-item prop="username">
    				<el-input v-model="form.username"  prefix-icon="iconfont icon-users"></el-input>
  				</el-form-item>

  				<el-form-item  prop="password">
    				<el-input v-model="form.password" type="password" prefix-icon="iconfont icon-3702mima"></el-input>
  				</el-form-item>

  				  <el-form-item class="flex-right">
   		 	 		<el-button type="primary" @click="doLogin">确认</el-button>
     				<el-button type="info" @click="resetLogin">重置</el-button>
  				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return {
				form: {
					username: 'admin',
					password: '123456'
				},
				loginRule: {
					username: [
						{ required: true, message: '请输入登陆名称', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入登陆密码', trigger: 'blur' },
            			{ min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			resetLogin(){
				this.$refs.loginRef.resetFields();
			},
			doLogin(){
				this.$refs.loginRef.validate( async valid => {
					const {data: result} = await this.$http.post('login', this.form)
					if(result.meta.status !== 200){
						return this.$message.error('登陆失败');
					}

					this.$message.success('登陆成功');
					console.log(result.data.token);
					window.sessionStorage.setItem('token', result.data.token)

					this.$router.push("/home")
				})
			}
		}
	}
</script>
<style lang="less" scoped>
.login{
	background-color: #2b4b6b;
	height: 100%;
}
.login_box{
	width: 440px;
	height: 300px;
	background-color: white;
	border-radius: 3px;
	position:absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.avator{
	width: 130px;
	height:130px;
	border: 1px solid #eee;
	border-radius: 50%;
	padding: 10px;
	box-shadow: 0 0 10px #ddd;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	 img{
	 	width: 100%;
	 	height: 100%;
	 	border-radius: 50%;
	 	background-color: #eee
	 }
}
.login-form{
	margin-top: 100px;
	padding: 0 10px;
}
</style>