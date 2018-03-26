<template>
<transition name="slide-fade">
<div class="row justify-content-md-center" style="min-height: 100%" v-cloak>
  <div class="col-lg-5 col-md-6 col-sm-8 register contain-loader" style="min-height: 400px;">
    <loading v-if="loading"></loading>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <form v-if="controls" class="user-form ml-4">
      <div v-for="(control, key) in controls" :key="key" class="form-group">
        <span v-if="control.type != 'File'">
            <span v-if="!isCropping">
                <div :style="{width: control.attributes.size + '%'}">
                    <input v-if="control.type !== 'Radio'" @focus="updateControl(control)" v-model="controls[key].value" :type="control.type" :class="control.attributes.class" :id="control.attributes.id" :placeholder="control.attributes.placeholder">
                </div>
                <select v-if="control.type == 'Select'" :class="control.attributes.class">
                    <option v-for="(options, key) in control.options.value_options" :key="key" >{{options[key]}}</option>
                </select>
                <span v-for="(opt, index) in control.options" :key="index" v-if="control.type.toLowerCase() == 'radio'">
                    <input @click="checker(control, opt.value)" :name="control.name" type="radio" :value="controls[key].options[index].value" :class="control.attributes.class"> <label style="padding-right: 6px;">{{opt.name}}</label>
                </span>                
                <small :class="control.attributes.hintclass">{{control.hint}}</small>
            </span>
        </span>
        <span v-else>
            <input @change="selectImage" :id="control.id" :type="control.type" :size="control.attributes.size" class="file-input" :placeholder="control.attributes.placeholder">
            <small :class="control.attributes.hintclass">{{control.hint}}</small>
            <span id="passview">
                <button class="btn btn-sm btn-success active" @click.prevent="cropImage(control)" v-if="showBtn" style="display: inline;">crop image</button>
                <button class="btn btn-sm btn-danger " @click.prevent="cancelCrop" v-if="showBtn" style="display: inline;">cancel</button>
            </span>
        </span>
      </div>
      <button v-if="!isCropping" @click.prevent="register" type="submit" class="btn btn-primary" id="register">Register</button>
    </form>
  </div>
</div>
</transition>
</template>

<script>
import loadImage from 'blueimp-load-image';
import Croppr from 'croppr';
import { mapState, mapActions } from 'vuex';
import utils from '@/lib/utils';
import Auth from '@/lib/Auth';
import Loading from '../../components/Loading';
export default {
  name: 'register',
  data () {
    return {
      controls: null,
      controlKeys: null,
      showBtn: false,
      selectedBox: [],
      isCropping: false,
      cropRatio: 1,
      gender: null,
      marital: null,
      loading: false,
      error: false,
    };
  },
  watch: {
    //   '$route': 'fetchForm'
  },
  created() {
    this.fetchForm();     
  },
  components:{
      'loading': Loading
  },
  methods: {
        ...mapActions({
          createAccount: 'accounts/createAccount',
          getGetForm: 'accounts/getGetForm',
          postGetForm: 'accounts/postGetForm',
          getStoredFbProfile: 'home/getStoredFbProfile'
        }),
        updateControl(control){
            control.attributes.class = "form-control";
            control.attributes.hintclass = "form-text text-muted";
            if(control.info){
                control.hint = control.info;
            }
        },
        checker(control, value){
            control.value = value; 
            control.hint = null;       
        },
        fetchForm(){
            let vm = this;
            let profile = this.$store.state.home.profile;
            let keys = [];
            vm.loading = true;
            let data = {};
            if(typeof profile === 'object'){
                keys = Object.keys(profile);
                for(var key in keys){
                    data[keys[key]] = profile[keys[key]];
                }
            }
            if(keys.length > 0){
                this.postGetForm({url: '/accounts/register', data: data})
                .then(res => {
                    this.controls = utils.sortObjects(res.data, 'order');              
                    vm.loading = false;
                })
                .catch(err => {
                    console.log(err);
                });
            }else{
                this.getGetForm({url: '/accounts/register'}).then(res =>{
                    this.controls = utils.sortObjects(res.data, 'order');              
                    vm.loading = false;
                }).catch(err => {
                    vm.error = err;
                });
            }
        },
        register: function(e){
          let data = {};
          let vm = this;
          let button = document.getElementById('register');
          if(utils.hasClass(button.firstChild, 'fa-spin')){
              return;
          }
          let i = document.createElement('i');
          let nfa = document.createElement('i');
          utils.addClass(nfa, 'fa fa-refresh fa-spin magr');
          button.insertBefore(nfa, button.firstChild);
          let keys = Object.keys(this.controls); 
          keys.forEach(key => {
            data[key] = this.controls[key].value || '';
          });
          var resp = this.createAccount({url: '/accounts/register', data: data})
          .then(res => {
              if(res.data.message === 'success'){
                  Auth.setToken(res.data.token);
                  Auth.setPassport(res.data.passport);
                  this.$router.push('/posts/create');
              }else{
                let button = document.getElementById('register');
                button.removeChild(button.firstChild);
                for(var key in vm.controls){
                    if(res.data[key] !== undefined){
                        Object.keys(res.data[key]).forEach(ky => {
                            vm.controls[key].info = vm.controls[key].hint;
                            vm.controls[key].hint = res.data[key][ky];
                            if(vm.controls[key].type.toLowerCase() !== 'radio' && vm.controls[key].type.toLowerCase() !== 'file'){
                                vm.controls[key].attributes.class = "form-control input-error";
                            }
                            vm.controls[key].attributes.hintclass = "form-text text-muted error"
                        });
                    }                   
                }
              }
          })
          .catch(err => {
              console.log(err);              
          });
        },
        dataURLtoBlob: function(dataurl){
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }            
            return new Blob([u8arr], {type:mime});
        },
        cancelCrop(e){
            e.preventDefault();
            this.isCropping = false;
            this.showBtn = false;
            var prevew = document.createElement('img');
            prevew.id = 'prevew';
            prevew.src = '';
            //empty the blob in the file control
            this.controls.passport.value = '';
            //reset the file input
            var passport = this.$el.querySelector('#passport');
            passport.value = '';

            var passview = this.$el.querySelector('#passview');
            var containa = this.$el.querySelectorAll('.croppr-container');
            if(containa.length){
                Array.prototype.forEach.call( containa, function( node ) {
                    node.parentNode.removeChild( node );
                });
            }
        },
        cropImage(control){
            if(control.info){
                control.hint = control.info;
            }
            var image = this.$el.querySelector('.croppr-image');
            var tnCanvas = document.createElement('canvas');
            var newWidth = this.selectedBox.width;
            var newHeigth = this.selectedBox.height;
            tnCanvas.width = newWidth;          
            tnCanvas.height = newHeigth;
            var tnCtx = tnCanvas.getContext('2d');
            var bufferCanvas = document.createElement('canvas');
            var bufferCtx = bufferCanvas.getContext('2d');
            
            bufferCanvas.width = image.width + 1000;
            bufferCanvas.height = image.height + 1000;
            bufferCtx.drawImage(image, 0, 0);
            tnCtx.drawImage(bufferCanvas, 
                    this.selectedBox.x, 
                    this.selectedBox.y,
                    newWidth, newHeigth,
                    0, 0, newWidth, newHeigth);
            var prevew = document.createElement('img');
            prevew.id = 'prevew';
            prevew.width = '60px';
            prevew.src = tnCanvas.toDataURL("image/jpeg");
            //save the blob in the file control           
            this.controls.passport.value = this.dataURLtoBlob(tnCanvas.toDataURL("image/jpeg"));
            var passview = this.$el.querySelector('#passview');
            var containa = this.$el.querySelectorAll('.croppr-container');
            if(containa.length){
                Array.prototype.forEach.call( containa, function( node ) {
                    node.parentNode.removeChild( node );
                });
            }
            this.isCropping = false;
            this.showBtn = false;
            passview.insertAdjacentElement('afterBegin', prevew);
        },
        selectImage: function(e){
            var imgPrevew = this.$el.querySelector('#prevew');
            if(imgPrevew){
                imgPrevew.parentNode.removeChild(imgPrevew);
            }            
            var vm = this;
            var prevew = document.createElement('img');
            prevew.id = 'prevew';
            var containa = this.$el.querySelectorAll('.croppr-container');
            var passview = this.$el.querySelector('#passview');
            passview.insertAdjacentElement('afterBegin', prevew);
            if(containa.length){
                Array.prototype.forEach.call( containa, function( node ) {
                    node.parentNode.removeChild( node );
                });
            }
                //console.log(containa.length);     
            var loadingImage = loadImage(
                e.target.files[0],
                function (img) {
                    prevew.src = img.toDataURL("image/jpeg");  
                    prevew.style.display = 'block';
                    var croppr = new Croppr('#prevew', {
                        aspectRatio: vm.cropRatio,
                        onCropEnd: function(data){
                           vm.selectedBox = data;
                        },
                        onInitialize: function(instance){
                            vm.selectedBox = instance.getValue();                            
                        }
                    });
                    vm.isCropping = true;
                    vm.showBtn = true;                     
                },
                {
                    maxHeight: 400,
                    canvas: true,
                    pixelRatio: window.devicePixelRatio,
                    downsamplingRatio: 0.3,
                    orientation: true
                }
            );
            if (!loadingImage) {
                console.log('image failed to load'); 
                return;      
            }
        }
  }
};
</script>

<style lang='scss'>
form.user-form{
    line-height: 0.5 !important;
    margin: 20px 0px;
}
form.user-form input[type=file]{
    line-height: 1.5 !important;
}
.form-control {
    border: 1px solid #c2afaf !important;
    border-radius: 0 !important;
    padding: 0.375rem 0.75rem !important;
    margin-bottom: 8px;
    margin-top: 15px;
}
.marital, .gender, .file-input{
    margin-bottom: 8px;
    margin-top: 5px;
}

.form-group {
    margin-bottom: 0.6rem;
}
.passport{
    position: relative;
}

#prevew{
    height: auto;
    width: 40%;
    border-radius: 50%;
}
#passview{
    max-width: 400px !important;
    display: block;
}
button{
    margin-top: 4px;
}
#register{
    margin-top: 15px;
    width: 100px;
}
.register{
    border-left: cadetblue solid thin;
    border-right: cadetblue solid thin;
}
.magr{
    margin-right: 5px;
}
.croppr-container * {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
}

.croppr-container img {
    vertical-align: middle;
    max-width: 100%;
}

.croppr {
    position: relative;
    display: inline-block;
}

.croppr-overlay {
    background: rgba(0,0,0,0.5);
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    cursor: crosshair;
}

.croppr-region {
    border: 1px dashed rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 3;
    cursor: move;
    top: 0;
}

.croppr-imageClipped {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2;
    pointer-events: none;
}

.croppr-handle {
    border: 1px solid black;
    background-color: white;
    width: 10px;
    height: 10px;
    position: absolute;
    z-index: 4;
    top: 0;
}
.input-error {
    border: thin solid rgb(134, 10, 10) !important;
}
.error{
    color: rgb(248, 116, 116) !important;
    font-weight: bold;
}
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .5s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
