<template>
  <section class="top-nav">
    <nav id="nav" class="navbar navbar-expand-lg py-0">
      <div class="container-fluid">
        <button @click="linksToggle" class="navbar-toggler" data-toggle="collapse" data-target="#links" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
          <i class="fa fa-bars" aria-hidden="true"></i>
        </button>
        <button @click="accountsToggle" class="navbar-toggler" type="button" data-toggle="collapse" data-target="#accounts" aria-controls="navbarResponsive" aria-expanded="false" aria-label="User">
          <i class="fa fa-user"></i>
        </button>
        <div class="collapse navbar-collapse" id="links">
          <ul class="navbar-links">
            <li v-for="menu in menus" v-if="menu.submenus" class="nav-item dropdown" :key="menu.name"> 
               <router-link class="nav-link dropdown-toggle" :to="{name: menu.to}" id="layouts" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{menu.name}}</router-link>
              <div class="dropdown-menu" aria-labelledby="layouts">
                <router-link v-for="submenu in menu.submenus" class="dropdown-item" :to="{}" :key="submenu.name">{{submenu.name}}</router-link>
              </div>
            </li>
            <li v-else class="nav-item"><router-link class="nav-link" :to="{name: menu.to}">{{menu.name}}</router-link> </li>
          </ul>
        </div>
        <div class="collapse navbar-collapse" id="accounts">
          <ul class="navbar-accounts">
            <li v-if="loggedIn" class="profile"><img class="img-fluid" style="width: 40px; height: auto; border-radius: 50%;" v-lazy="profileImage" >
            <!-- <img class="img-rounded-50 img-fluid" width="40" height="40" :data-src="profileImage" alt=""> -->
            </li>
            <li v-if="loggedIn" class=""><a class="btn btn-link" style="border: none" @click="doLogout">Logout</a></li>
            <li v-if="!loggedIn" class=""><router-link :to="{name: 'registerAccount'}">Join us</router-link></li>
            <li v-if="!loggedIn" class=""><router-link :to="{name: 'xhome'}">Login</router-link></li>
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
    navbarClose(){
      var vm = this;
      var links = document.getElementById('links');
      var accounts = document.getElementById('accounts');
      var navbar = document.getElementById('nav');
      document.addEventListener('click', function(event) {
        var isClickInside = navbar.contains(event.target);
        if (!isClickInside) {
          vm.removeClass(links, 'open');
          vm.removeClass(accounts, 'open');
          vm.removeClass(nav, 'opened');
        }
      });
    },
    linksToggle(){
      var nav = document.getElementById('nav');
      var links = document.getElementById('links');
      var accounts = document.getElementById('accounts');
      if(this.hasClass(accounts, 'open')){
        this.togglar(accounts, 'open');
        this.togglar(nav, 'opened');
      }
      this.togglar(links, 'open');
      this.togglar(nav, 'opened');
    },
    accountsToggle(){
      var nav = document.getElementById('nav');
      var links = document.getElementById('links');
      var accounts = document.getElementById('accounts');
      if(this.hasClass(links, 'open')){
        this.togglar(links, 'open');
        this.togglar(nav, 'opened');
      }
      this.togglar(accounts, 'open');      
      this.togglar(nav, 'opened');
    },
    hasClass(el, className){
      if (el.classList){
        return el.classList.contains(className);
      }else{ 
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
      }
    },
    removeClass(el, className){
      if (el.classList){
        el.classList.remove(className);
      }else{
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
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
    setTimeout(function(){
      window.linksToggle = this.linksToggle;
      window.accountsToggle = this.accountsToggle;  
      window.navbarClose = this.navbarClose();
    }, 10);
  },
  computed: {
    profileImage(){
      return config.url + '/uploads/' + Auth.getPassport('passport');
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
  nav.opened ul.navbar-links{
    margin: 10px 0 0 0;
    padding: 0px;
    li.nav-item{
      float: none;
      list-style: none;
      margin-left: 0px;
      border-bottom: 1px solid transparent;
      a{
        border: none;
        color: white;
        text-transform: uppercase;
      };
      &:hover, &:active, &:focus{
        border-bottom: 1px solid #141517;
      }
    };
  }
  .top-nav ul.navbar-links{
    li{
      float: left;
      list-style: none;
        a {
          color: #137439;
          font-size: 14px;
          font-weight: 700;
          padding: 8px 10px;
          margin: 4px 5px;
          text-transform: uppercase;
          border-bottom: 1px solid transparent;
      };
    };
  }
  .top-nav div#accounts{
    position: relative; 
    ul.navbar-accounts{
      position: absolute;
      right: 10%;
      li{
        list-style: none;
        float: right;
          a{
            color: #137439;
            font-size: 14px;
            font-weight: 700;
            padding: 8px 10px;
            margin: 4px 5px;
            text-transform: uppercase;
            border-bottom: 1px solid transparent;
        };
      };
    };
  }
  nav.opened li.nav-item:hover, nav.opened li.nav-item:focus, nav.opened li.active {
      color: #141517;
      background: rgba(17, 121, 72, 0.9);
  }
  nav.opened div#accounts{
    ul.navbar-accounts{
      position: relative;
      right: 0px;
      list-style: none;
      margin-top: 5px;
      display: block;
      float: right;
      li{
      float: none !important;
      margin-top: 10px;
      text-align: right;
      padding-bottom: 2px; 
        &:hover{
          background: rgba(17, 121, 72, 0.9);;
        };
        a{
          border: none;
          color: wheat;
          text-transform: uppercase;
        };
      };
    };
  }
</style>
