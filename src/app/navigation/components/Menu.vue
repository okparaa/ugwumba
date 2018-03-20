<template>
  <section class="top-nav">
    <nav id="nav" class="navbar navbar-expand-lg py-0">
      <div class="container-fluid">
        <button @click="navBarToggle" class="navbar-toggler" data-toggle="collapse" data-target="#links" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </button>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#account" aria-controls="navbarResponsive" aria-expanded="false" aria-label="User">
          <i class="fa fa-user"></i>
        </button>
        <div class="collapse navbar-collapse" id="collapse">
          <ul class="navbar-nav">
            <li v-for="menu in menus" v-if="menu.submenus" class="nav-item dropdown" :key="menu.name"> 
               <router-link class="nav-link dropdown-toggle" :to="{name: menu.to}" id="layouts" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{menu.name}}</router-link>
              <div class="dropdown-menu" aria-labelledby="layouts">
                <router-link v-for="submenu in menu.submenus" class="dropdown-item" :to="{}" :key="submenu.name">{{submenu.name}}</router-link>
              </div>
            </li>
            <li v-else class="nav-item"><router-link class="nav-link" :to="{name: menu.to}">{{menu.name}}</router-link> </li>
          
          <span class="joiner" v-if="loggedIn">
              <li class="profile"><img class="img-fluid" style="width: 40px; height: auto; border-radius: 50%;" v-lazy="profileImage" >
              <!-- <img class="img-rounded-50 img-fluid" width="40" height="40" :data-src="profileImage" alt=""> -->
              </li>
              <li><a class="btn btn-link" style="border: none" @click="doLogout">Logout</a></li>
          </span>
          <span class="joiner" v-else>
              <li><router-link :to="{name: 'registerAccount'}">Join us</router-link></li>
              <li><router-link :to="{name: 'xhome'}">Login</router-link></li>
          </span>
          </ul>
        </div>
      </div>
    </nav>
  </section>
</template>
<script>
import * as Auth from '@/lib/Auth';
import config from '@/lib/config';
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
    navBarToggle(){
      var nav = document.getElementById('nav');
      var collapse = document.getElementById('collapse');
      this.togglar(collapse, 'open');
      this.togglar(nav, 'opened');
    },
    togglar(el, className){
      if(el.classList) {
        el.classList.toggle(className);
      }else {
        var classes = el.className.split(' ');
        var existingIndex = -1;
        for(var i = classes.length; i--;) {
          if(classes[i] === className)
            existingIndex = i;
        }
        if(existingIndex >= 0) {
          classes.splice(existingIndex, 1);
        }else{
          classes.push(className);
        }
        el.className = classes.join(' ');
      }
    },
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
      return config.url + '/uploads/' + window.localStorage.getItem('passport');
    }
  }
}
</script>
<style lang="scss">
  nav.opened div.open{
    display: block !important;
  }
  nav.opened{
   background: rgba(17, 121, 72, 0.9);
   color: #fff;
  }
  nav.opened li a{
    border: none;
    color: white;
  }
  nav.opened li.nav-item:hover, nav.opened li.nav-item:focus, nav.opened li.active {
      border-bottom: 2px solid transparent;
      color: #141517;
  }
</style>
