<template>
  <div id="home">
    <div class="landing">
      <div id="login"  v-if="!loggedIn()">
        <fb-login class="button mb-2" appId="394530471010474" @login="onLogin" @logout="onLogout" @sdk-loaded="sdkLoaded"></fb-login>
         <p class="mb-4"></p>
         <form>
           <p id="user-credential">Username</p>
           <input type="text" v-model="controls.username" :name="username" id="username" placeholder="Enter Username">
           <p id="pass-credential">Password</p>
           <input type="password" v-model="controls.password" name="password" id="password" placeholder="Enter Password">
           <button id="login-button" @click.prevent.stop="accountLogin" name="submit">Login</button>
         </form>
         <router-link :to="{}">Forget Password</router-link> |  <router-link :to="{name: 'registerAccount'}">Join us</router-link>
      </div>
      <xmenu :menus="menus" @logout="logout"></xmenu>
    </div>
  </div>
</template>

<script>
const Menu = () => import('../../navigation/components/Menu');
const FbLogin = () => import('../../components/FbLogin');
import { mapActions, mapGetters } from 'vuex';
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
        storeFbProfile: 'home/storeFbProfile',
        setConnected: 'accounts/setConnected'
      }),
      ...mapGetters({
        getConnected: 'accounts/getConnected'
      }),
      loggedIn(){
        return this.getConnected();
      },
      logout(){
        this.setConnected(false);
      },
      accountLogin(){
        let button = document.getElementById('login-button');
        if(utils.hasClass(button.firstChild, 'fa-spin')){
            return;
        }
        let i = document.createElement('i');
        let nfa = document.createElement('i');
        utils.addClass(nfa, 'fa fa-refresh fa-spin magr');
        button.insertBefore(nfa, button.firstChild);
       Auth.login({data: this.controls, url: 'accounts/login'})
       .then(res => {
         button.removeChild(button.firstChild);
          if(res.data && res.data.message == 'success'){
            this.controls.username = null;
            this.controls.password = null;
            if(res.data.token){
              this.setConnected(true);
              Auth.setToken(res.data.token);          
              Auth.setItem('passport', res.data.passport);          
            }
            this.$router.push('/posts/create'); 
          }else{
            var username = document.querySelectorAll('#user-credential');
            var password = document.querySelectorAll('#pass-credential');
            utils.addClass(username, 'error');
            utils.addClass(password, 'error');

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
    onLogin(data) {
      if(data.response.status == 'connected'){
        this.isConnected = true;
        this.profile.access_token = data.response.authResponse.accessToken;    
        this.getUserData();
      }
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
    height: auto;
    background: rgba(17, 121, 72, 0.7);
    color: #fff;
    box-sizing: border-box;
    top: 30%;
    left: 40%;
    position: absolute;
    border-radius: 10px;
    padding: 20px 20px;
  }
  @media (max-width: 376px) { 
    #login{
      width: 80%;
      top: 30%;
      left: 10%;
    }
   }

  @media (min-width: 376px) { 
    #login{
      width: 70%;
      top: 30%;
      left: 20%;
    }
   }

  @media (min-width: 576px) { 
    #login{
      width: 40%;
      top: 30%;
      left: 33%;
    }
   }

  // Medium devices (tablets, 768px and up)
  @media (min-width: 768px) { 
     #login{
      width: 30%;
      top: 30%;
      left: 37%;
    }
   }

  // Large devices (desktops, 992px and up)
  @media (min-width: 992px) { 
     #login{
      width: 25%;
      top: 30%;
      left: 38%;
    }
   }

  // Extra large devices (large desktops, 1200px and up)
  @media (min-width: 1200px) { 
     #login{
      width: 25%;
      top: 30%;
      left: 38%;
    }
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
  margin-bottom: 10px;
}
#login #username, #password{
  border: none;
  border-bottom: 1px solid #fff;
  background: transparent;
  outline: none;
  color: #fff;
  margin-bottom: 10px;
  font-size: 16px;
}
#login #login-button{
  border: none;
  outline: none;
  width: 100%;
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
