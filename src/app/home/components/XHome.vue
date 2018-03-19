<template>
<keep-alive>
  <div id="home">
    <div class="landing">
      <div id="login"  v-if="!loggedIn">
        <facebook-login :appId="394530471010474" class="text-center"></facebook-login>
        <div class="text-center mb-1 mt-1">OR</div>
         <form>
           <p>Username</p>
           <input type="text" v-model="controls.username" :name="username" id="username" placeholder="Enter Username">
           <p>Password</p>
           <input type="password" v-model="controls.password" name="password" id="password" placeholder="Enter Password">
           <input type="submit" @click="accountLogin" name="submit" value="Login">
           <router-link :to="{}">Forget Password</router-link> |  <router-link :to="{name: 'registerAccount'}">Join us</router-link>
         </form>
      </div>
      <xmenu :menus="menus" @logout="logout"></xmenu>
    </div>
  </div>
</keep-alive>
</template>

<script>
import { Menu } from '../../navigation/components';
import { FacebookLogin } from '../../components';
import { mapActions } from 'vuex';
import * as Auth from '../../../lib/Auth';
import { guid } from '@/lib/guid';
export default {
  name: 'xhome',
  data() {
    return {
       menus: [ 
        { name: "Home", to: 'xhome'},
        { name: "Profile", to: ''},
        { name: "Events", to: ''},
        { name: "Politics", to: ''},
        { name: "Business", to: ''},
      ],
      loggedIn: this.checkStatus(),
      username: null,
      controls: {
        username: null,
        password: null
      },
    };
  },
  computed: {

  },
  components: {
     'xmenu': Menu,
     'facebook-login': FacebookLogin
  },
  created(){
    this.username = guid();
  },
  methods: {
      ...mapActions({
      }),
      logout(){
        this.checkStatus();
      },
      checkStatus(){
        this.loggedIn = Auth.isloggedIn();
        return this.loggedIn;
      },
     accountLogin(e){
       e.preventDefault();
       Auth.login({data: this.controls, url: 'accounts/login'})
       .then(res => {
         if(res.data.token){  
            localStorage.setItem('token', res.data.token);          
            localStorage.setItem('passport', res.data.passport);          
          }
          if(res.data.message == 'success'){
            this.controls.username = null;
            this.controls.password = null;
            this.$router.push('/posts/create'); 
          }
      })
      .catch(err => {
        console.log(err);    
      }); 
     },
   }
};
</script>

<style lang='scss'>
  html, body, .x-home, #app{
    height: 100%;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  #home{
    background: url('../../../images/a1.jpg') no-repeat 50% 50%;
    display: table;
    height: 100%;
    width: 100%;
    background-size: cover;
  }
  .landing{
    display: table-cell;
  }
  #login{
    width: 320px;
    height: 280px;
    background: rgba(17, 121, 72, 0.7);
    color: #fff;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    top: 50%;
    left: 50%;
    position: absolute;
    border-radius: 10px;
    padding: 20px 20px;
  }
  .top-nav{
    background-color: rgba(0, 0, 0, 0) !important;
    border-bottom: none !important;
    padding: 0;
    width: 100%;
  }
  .top-nav li a {
      color: #137439;
      font-size: 14px;
      font-weight: 700;
      padding: 0 10px;
      margin: 10px 5px;
      text-transform: uppercase;
      border-left: 1px solid #2b2b2b;
  }
  .top-nav li {
      border-bottom: 2px solid transparent;
      color: #141517;
      margin: 0 5px;
  }
  .top-nav li.nav-item:hover, .top-nav li.nav-item:focus, .top-nav li.active {
      border-bottom: 2px solid #fd3a13;
      color: #141517;
  }
  h1{
    margin: 0;
    padding: 0 0 20px;
    text-align: center;
    font-size: 22px;
  }
#login p{
  margin: 0;
  padding: 0;
  font-weight: bold;
}
#login input{
  width: 100%;
  margin-bottom: 20px;
}
#login #username, #password{
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  outline: none;
  color: #fff;
  font-size: 16px;
}
#login input[type="submit"]{
  border: none;
  outline: none;
  height: 40px;
  background: #137439;
  color:#fff;
  font-size: 18px;
  border-radius: 20px;
  &:hover{
    cursor: pointer;
    background: #39dc79;
    color: #000;
  }
}
#login a{
    text-decoration: none;
    font-size: 14px;
    color: #fff;
    &:hover{
      color: #39dc79;
    }
  }
</style>
