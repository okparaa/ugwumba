<template>
<keep-alive>
  <div id="home">
    <div class="landing">
      <div id="login"  v-if="!loggedIn">
        <fb-login class="button mb-2" appId="394530471010474" @login="onLogin" @logout="onLogout" @sdk-loaded="sdkLoaded"></fb-login>
         <p class="mb-4"></p>
         <form>
           <p class="credential">Username</p>
           <input type="text" v-model="controls.username" :name="username" id="username" placeholder="Enter Username">
           <p class="credential">Password</p>
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
const Menu = () => import('../../navigation/components/Menu');
const FbLogin = () => import('../../components/FbLogin');
import { mapActions } from 'vuex';
import Auth from '@/lib/Auth';
import utils from '@/lib/utils';
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
      fb_scopes: 'id,first_name, last_name, name, picture.width(150).height(150), gender, email',
      isConnected: false,
      profile: {
        firstname: '',
        lastname: '',
        gender: '',
        username: '',
        uid: '',
        passport: '',
        access_token: '',
      },
      FB: undefined
    };
  },
  computed: {

  },
  components: {
     'xmenu': Menu,
     'fb-login': FbLogin
  },
  created(){
    this.username = utils.guid();
  },
  methods: {
      ...mapActions({
        storeFbProfile: 'home/storeFbProfile'
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
          if(res.data.message == 'success'){
            this.controls.username = null;
            this.controls.password = null;
            if(res.data.token){  
              Auth.setToken(res.data.token);          
              Auth.setItem('passport', res.data.passport);          
            }
            this.$router.push('/posts/create'); 
          }else{
            var credentials = document.querySelectorAll('.credential');
            credentials.forEach(cred => {
              utils.addClass(cred, 'error');
            })
          }
      })
      .catch(err => {
        console.log(err);    
      }); 
     },
    getUserData() {
      window.FB.api('/me', 'GET', { fields: this.fb_scopes },
        profile => {
          this.profile.uid = profile.id;
          this.profile.passport = profile.picture.data.url;
          this.profile.firstname = profile.first_name;
          this.profile.lastname = profile.last_name;
          this.profile.username = profile.email;
          this.profile.gender = profile.gender;
          this.storeFbProfile(this.profile);
          this.$router.push('/accounts/register');
      })
    },
    sdkLoaded(payload) {
      this.isConnected = payload.isConnected
      this.FB = payload.FB;
    },
    onLogin(response) {
      this.isConnected = true;
      this.profile.access_token = response.response.authResponse.accessToken;    
      this.getUserData();
    },
    onLogout(response) {
      this.isConnected = false;
    }
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
.login {
  width: 200px;
  margin: auto;
}

.list-item:first-child {
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.button {
  margin: auto;
}
.input-error {
    border: thin solid rgb(134, 10, 10) !important;
}
.error{
    color: rgb(248, 116, 116) !important;
    font-weight: bold;
}
</style>
