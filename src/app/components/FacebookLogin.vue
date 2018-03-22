<template>
    <div>
    <button @click="buttonClicked">
      <div class="spinner" v-if="isWorking"></div>
      <img :src="icon" v-if="!isWorking"> {{getButtonText}} 
    </button>
  </div>
</template>

<script>
import config from '@/lib/config';
import Cookie from 'js-cookie';
import { mapActions } from 'vuex';
  export default {
    name: 'fbk',
    props: {
      appId: {
        type: [Number, String],
        required: true
      },
      lang: {
        type: String,
        default: 'en_US'
      },

      url: {
        type: String,
        default: window.location.href
      },

      width: {
        type: String,
        default: '10'
      },

      size: {
        type: String,
        default: 'large'
      },

      rows: {
        type: String,
        default: '1'
      },

      numPosts: {
        type: Number,
        default: 5
      }
    },

    mounted () {
      if(window.FB) {
        this.reset()
        FB.Event.subscribe('xfbml.render', this.finished_rendering);
        return;
      }
      this.init();
      window.checkLoginState = this.checkLoginState;
    },

    computed: {
      currentUrl () {
        return (this.url || window.location.href)
      }
    },
    methods: {
      ...mapActions({
        sendSignedRequest: 'accounts/sendSignedRequest'
      }),
      checkLoginState() {
        FB.getLoginStatus(function(res){
          if(res.status === 'connected'){
              var signedRequest = res.authResponse.signedRequest;
              vm.authenticate(signedRequest);
            }else{
              window.location.href = config.fbkUrl;
            }
        });
      },
      authenticate(signedRequest){
        let vm = this;
        console.log('this is inside authentication');
        this.sendSignedRequest({url: 'accounts/sr', data: signedRequest})
        .then(res => {
          if(res.data.message == 'success'){
            Auth.setToken(res.data.token);
            Auth.setItem('passport', res.data.passport);
            Auth.setItem('email', res.data.email);
            vm.$router.push('/accounts/register');
          }
        })
        .catch(err => {
          console.log(err);          
        });
      },
      finished_rendering(){
        var loading = this.$refs.loading;
        loading.parentNode.removeAttribute('style');
        loading.parentNode.removeChild(loading);
      },
      reset () {
        window.FB.XFBML.parse();
      },
      init () {
        let src = `https://connect.facebook.net/${this.lang}/sdk.js`;
        let appId = this.appId
        let vm = this;
        setTimeout(function() {
          window.fbAsyncInit = function() {
            FB.init({
              appId     : appId,
              xfbml     : true,
              cookie    : true,
              status    : true,
              version   : 'v2.12'
            });
            FB.Event.subscribe('xfbml.render', vm.finished_rendering);
          };
          ;(function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = src;
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        },10);
      }
    }
  }
</script>
