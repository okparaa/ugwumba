<template>
<div @click="buttonClicked" id="spinner" style="font-size: 16px; font-weight: bold; cursor: pointer; padding-top: 5px; background: #4267b2;border-radius: 5px;color: white; height: 40px; text-align: center; width: 100%;">
  <i class="fa fa-facebook"></i>  <div class="fa fa-spin fa-spinner" v-if="isWorking"> </div> {{getButtonText}} <img style="width: 30px;" :src="picture" v-if="isConnected"/>
  <div class="text-center text-bold" style="font-size: 16px; margin-top: 10px;">OR</div>
</div>
</template>
<script>
import  * as Fbfxns from '@/lib/Fbfxns';
export default {
  name: 'fblogin',
  data() {
    return {
      isWorking: false,
      isConnected: false,
      fb_scopes: 'id, first_name',
      picture: null,
    }
  },
  computed: {
    getButtonText() {
      switch (this.isConnected) {
        case true:
          return this.continueLabel;
        case false:
          return this.loginLabel;
        default:
          return 'Login with Facebook';
      }
    },
  },
  methods: {
    buttonClicked() {
      this.$emit('click')
      if (this.isConnected) {
        this.logout();
      } else {
        this.login();
      }
    },
    logout() {
      this.isWorking = true;
      Fbfxns.fbLogout()
        .then(response => {
          this.isWorking = false;
          this.isConnected = false;
          this.$emit('logout', response)
        }
        );
    },
    login() {
      this.isWorking = true;
      Fbfxns.fbLogin(this.loginOptions)
        .then(response => {
          if (response.status === 'connected') {
            this.isConnected = true;
          } else {
            this.isConnected = false;
          }
          this.isWorking = false;
          this.$emit('login', {
            response,
            FB: window.FB
          })
        });
    }
  },
  props: {
    appId: {
      type: String,
      required: true
    },
    version: {
      type: String,
      default: 'v2.12'
    },
    continueLabel: {
      type: String,
      default: 'Continue'
    },
    loginLabel: {
      type: String,
      default: 'Login with Facebook'
    },
    loginOptions: {
      type: Object,
      default: function() {
        return {
          scope: 'email'
        }
      }
    },
  },
  mounted() {
    this.isWorking = true;
    if(window.FB){
      Fbfxns.getLoginStatus()
      .then(response => {
        if (response.status === 'connected') {
          this.isConnected = true;
        }
        this.isWorking = false;
        /** get-initial-status to be depcreated on next major version */
        this.$emit('get-initial-status', response);
        this.$emit('sdk-loaded', {
          isConnected: this.isConnected,
          FB: window.FB
        });
      });
    }

    Fbfxns.loadFbSdk(this.appId, this.version)
      .then(loadingResult => {})
      .then(() => Fbfxns.getLoginStatus())
      .then(response => {
        if (response.status === 'connected') {
          this.isConnected = true;
        }
        this.isWorking = false;
        /** get-initial-status to be depcreated on next major version */
        this.$emit('get-initial-status', response);
        this.$emit('sdk-loaded', {
          isConnected: this.isConnected,
          FB: window.FB
        });
      });
  }
}
</script>
