<template>
  <div>
    <!-- menu-top -->
    <div class="menu-top p-1">
        <div class="row px-3">
          <div class="col-md-6 col-lg-6 date-sec">
            <div id="Date" class="mt-1">{{today}}</div>
          </div>
          <div class="col-md-4 col-lg-3 ml-auto">
            <div class="social-icon">
              <router-link :to="{}" class=" fa fa-facebook"></router-link>
              <router-link :to="{}" class=" fa fa-twitter"></router-link>
              <router-link :to="{}" class=" fa fa-google-plus"></router-link>
              <router-link :to="{}" class=" fa fa-linkedin"></router-link>
              <router-link :to="{}" class=" fa fa-youtube"></router-link>
              <router-link :to="{}" class=" fa fa-vimeo-square"></router-link>
            </div>
          </div>
        </div>
      </div>
  <xmenu :menus="menus"></xmenu>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import Menu from './Menu';
import { moment } from '../../../lib/moment';
import  * as Auth  from '@/lib/Auth';
export default {
  name: "navigation",
  data(){
    return{
      menus: [ 
        { name: "Home", to: 'xhome'},
        { name: "Profile", to: ''},
        { name: "Events", to: ''},
        { name: "Politics", to: ''},
        { name: "Business", to: ''},
      ]
    }
  },
  created(){
    
  },
  computed: {
    today(){
      return  moment((new Date()), 'dddd, MMMM d, yyyy d:mmtt', 'GMT');
    },
  },
  components:{
    "xmenu" : Menu
  },
  methods: {

  }
};
</script>

<style lang='scss'>
  .menu-top{
    background: #000000;
    color:  #fd3a13;
    font-size: .8rem;
    font-weight: bolder;
  }
  .pages{
      width: 95% !important;
      margin-top: 5px;
  }
  .social-icon a:hover {
      color: #fd3a13;
      text-decoration: none;
  }
  .social-icon a {
      border-left: 1px solid #2b2b2b;
      color: #ca1b1b;
      float: left;
      padding: 6px 13px;
      font-size: 16px;
      padding: 5px 12px;
  }
  .top-head {
      background-color: #141517;
      border-top: 1px solid #2b2b2b;
      color: #ffffff;
  }
  .top-head small {
      color: #c0c0c0;
      float: left;
      font-size: 14px;
      margin-left: 5px;
      margin-top: 5px;
      width: 100%;
  } 
  .top-head .admin-bar a {
      color: #fff;
      line-height: 49px;
      position: relative;
  }
  .top-head .admin-bar img {
      float: right;
      height: 50px;
      margin-left: 18px;
      width: 50px;
  }
  .top-head .bottomline{
      margin-top: -3px;
  }
  h1, h2, h3, h4, h5 {
      font-family: 'Source Sans Pro', sans-serif;
      font-family: 'Montserrat', sans-serif;
  }
  .top-nav {
      background-color: #fff;
      border-bottom: 1px solid #dbdbdb;
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
</style>
