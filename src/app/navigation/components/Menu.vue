<template>
  <section class="top-nav">
    <nav class="navbar navbar-expand-lg py-0">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </button>
        <div class="collapse navbar-collapse" id="navigator">
          <ul class="navbar-nav">
            <li v-for="menu in menus" v-if="menu.submenus" class="nav-item dropdown" :key="menu.name"> 
               <router-link class="nav-link dropdown-toggle" :to="{name: menu.to}" id="layouts" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{menu.name}}</router-link>
              <div class="dropdown-menu" aria-labelledby="layouts">
                <router-link v-for="submenu in menu.submenus" class="dropdown-item" :to="{}" :key="submenu.name">{{submenu.name}}</router-link>
              </div>
            </li>
            <li v-else class="nav-item"><router-link class="nav-link" :to="{name: menu.to}">{{menu.name}}</router-link> </li>
          </ul>
          <ul class="joiner" v-if="loggedIn">
              <li class="profile"><img class="img-fluid" style="width: 40px; height: auto; border-radius: 50%;" v-lazy="profileImage" >
              <!-- <img class="img-rounded-50 img-fluid" width="40" height="40" :data-src="profileImage" alt=""> -->
              </li>
              <li><a class="btn btn-link" style="border: none" @click="doLogout">Logout</a></li>
          </ul>
          <ul class="joiner" v-else>
              <li><router-link :to="{name: 'registerAccount'}">Join us</router-link></li>
              <li><router-link :to="{name: 'xhome'}">Login</router-link></li>
          </ul>
        </div>
      </div>
    </nav>
  </section>
</template>
<script>
import * as Auth from '@/lib/Auth';
export default {
  props: {
    menus: {
      type: Array,
      default: []
    },
  },
  data(){
    return {
      loggedIn: this.chackStatus(),
    }
  },
  methods: {
    doLogout(){      
      Auth.logout();
      this.chackStatus();
      this.$emit('logout');
      this.$router.push('/');
    },
    chackStatus(){
      this.loggedIn = Auth.isloggedIn();
      return this.loggedIn;
    },
  },
  mounted(){
    // console.log('lazy);    
  },
  computed: {
    profileImage(){
      return 'http://ugwumba.org/uploads/'+window.localStorage.getItem('passport');
    }
  }
}
</script>
<style lang="scss">
  
</style>
