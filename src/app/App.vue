<template>
  <div id="app" v-cloak>
    <navigation v-if="displayFooter"></navigation>
    <div :class="container">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
    <xfooter v-if="displayFooter"></xfooter>
  </div>
</template>

<script>
import { Navigation } from "./navigation/components";
import { Footer } from "./components";
import { mapState } from 'vuex';
export default {
  name: "app",
  data(){
    return {
     }
  },
  components: {
    'navigation': Navigation,
    'xfooter': Footer
  },
  computed: {
    container(){
      if(this.$route.name == 'xhome'){
        return "x-home";
      }else{
        return "container-fluid pages";
      }
    },
    displayFooter(){
      if(this.$route.name == 'xhome')
        return false;
      else
      return true;
    }
  }
};
</script>
<style lang="scss">
 @import '../styles/bootstrap.scss';
 @import '../styles/font-awesome.min.scss';
body{
	color: #5a5a5a;
  	font-family: 'Open Sans', sans-serif;
  	font-size: 15px;
}
.pages{
    min-height: 500px;
}
[v-cloak]{
    display: none;
}
h1,h2,h3,h4,h5{
    /*font-family: 'Source Sans Pro', sans-serif;*/
    font-family: 'Montserrat', sans-serif;
}
a, a:hover, .btn{
    outline:none!important;
    text-decoration: none;
}
.title-small {
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
    margin: 6px 0 0;
    color: #545454;
    a{
        color: #141517;
        &:hover{
            color: #545454;
        }
    };
    
}
.title-large a {
    color: #141517;
    font-size: 18px;
    font-weight: bold;
    line-height: 27px;
    margin: 10px 0 5px;
}
.title-large a:hover, .title-large a:focus, .title-small a:hover, .title-small a:focus, .title-x-small a:focus, .title-x-small a:focus {
    color: #545454;
}
.navigator {
    position: relative;
}
.joiner{
    list-style: none;
    position: absolute;
    right: 5%;
    float: right;
}
.joiner li{
    display: inline-block;
    padding-top: 15px;
    margin: 0 5px;
}
.form-text {
    margin-top: 0.1rem;
}
@media only screen and (max-width: 567px){
    .admin-bar{display: none;}
}
@media only screen and (max-width: 667px){
    #rescueinfo{
        font-size: 1rem;
      }
}
@media only screen and (max-width: 867px){
    #rescueinfo{
        font-size: 1.5rem;
      }
} 
</style>