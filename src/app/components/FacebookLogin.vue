<template>
    <div id="spinner" style="background: #4267b2;border-radius: 5px;color: white; height: 40px; text-align: center; width: 100%;">
      <i ref="loading" class="pt-1 fa fa-spinner fa-spin fa-2x fa-fw"></i>   
      <div class="fb-login-button" scope="publish_actions, email" onlogin="checkLoginState" :data-width="width" :data-max-rows="rows" :data-size="size" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true"></div>
    </div>
</template>

<script>
  export default {
    name: 'VueFacebookComments',
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
      this.init()
    },

    computed: {
      currentUrl () {
        return (this.url || window.location.href)
      }
    },

    methods: {
      checkLoginState(){

      },
      finished_rendering(){
        console.log("finished rendering plugins");
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
        let elem = this;
        setTimeout(function() {
          window.fbAsyncInit = function() {
            FB.init({
              appId     : appId,
              xfbml     : true,
              cookie    : true,
              version   : 'v2.12'
            });
            FB.Event.subscribe('xfbml.render', elem.finished_rendering);
            
            FB.getLoginStatus(function(res){
              if(res.status === 'connected'){
                  var signedRequest = res.authResponse.signedRequest;
                  var data = signedRequest.split('.')[1];
                  data = JSON.parse(decode_base64(data));
                  console.log(res + 'from connected');
                  console.log(data);
                }else if(res.status === 'not_authorized'){
                  console.log(res + 'from not authorized');
                }else{
                  console.log('indeterminate');
                }
            });
          };

          ;(function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = src;
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        },50);
      }
    }
  }
</script>
