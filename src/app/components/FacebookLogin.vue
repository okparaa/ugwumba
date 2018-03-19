<template>
    <div id="spinner" style="background: #4267b2;border-radius: 5px;color: white;height: 40px; text-align: center; width: 250px;">
      Loading    
      <div style="float: none; margin: 0 auto;" class="fb-login-button" :data-width="width" :data-max-rows="rows" :data-size="size" data-button-type="continue_with" data-show-faces="false" data-auto-logout-link="false" data-use-continue-as="true"></div>
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
      finished_rendering(){
        console.log("finished rendering plugins");
        var spinner = document.getElementById("spinner");
        spinner.removeAttribute("style");
        spinner.removeChild(spinner.childNodes[0]);
      },
      reset () {
        let appId = this.appId;
        setTimeout(function(){
          FB.init({
              appId     : appId,
              xfbml     : true,
              cookie    : true,
              version   : 'v2.12'
            });
        }, 100)
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
          };

          ;(function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = src;
            fjs.parentNode.insertBefore(js, fjs);
          }(document, 'script', 'facebook-jssdk'));
        }, 200);
      }
    }
  }
</script>
