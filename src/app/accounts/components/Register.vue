<template>
<div class="row justify-content-md-center" v-cloak>
  <div class="col-lg-5 col-md-6 col-sm-8 register contain-loader">
    <div class="loading" v-if="loading">
        <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
        </div>
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
    <form v-if="controls" class="user-form ml-4">
      <div v-for="(control, key) in controls" :key="key" class="form-group">
        <span v-if="control.type != 'File'" >
            <span v-if="!isCropping">
                <input v-if="control.type !== 'Radio'" @focus="updateControl(control)" v-model="controls[key].value" :type="control.type" :size="control.attributes.size" :class="control.attributes.class" :id="control.attributes.id" :placeholder="control.attributes.placeholder">
                <select v-if="control.type == 'Select'" :class="control.attributes.class">
                    <option v-for="(options, key) in control.options.value_options" :key="key" >{{options[key]}}</option>
                </select>
                <span v-if="control.type == 'Radio'"> 
                    <span v-for="(opt, index) in control.options" :key="index">
                        <input @click="checker(control, opt.value)" :name="control.name" type="radio" :value="controls[key].options[index].value" :class="control.attributes.class"> <label style="padding-right: 6px;">{{opt.name}}</label>
                    </span>
                </span>
                <small :class="control.attributes.hintclass">{{control.hint}}</small>
            </span>
        </span>
        <span v-else>
            <input @change="selectImage" :id="control.id" :type="control.type" :size="control.attributes.size" class="form-control" :placeholder="control.attributes.placeholder">
            <small :class="control.attributes.hintclass">{{control.hint}}</small>
            <span id="passview">
                <button class="btn btn-sm btn-success active" @click="cropImage" v-if="showBtn" style="display: inline;">crop image</button>
                <button class="btn btn-sm btn-danger " @click="cancelCrop" v-if="showBtn" style="display: inline;">cancel</button>
	        </span>
        </span>
      </div>
      <button v-if="!isCropping" @click.prevent="register" type="submit" class="btn btn-success" id="register">Submit</button>
    </form>
  </div>
</div>
</template>

<script>
import loadImage from 'blueimp-load-image';
import Croppr from 'croppr';
import { mapState, mapActions } from 'vuex';
import { sortObjects } from '../../../utils';
import * as Auth from '@/lib/Auth';

export default {
  name: 'register',
  data () {
    return {
      controls: null,
      controlKeys: null,
      showBtn: false,
      selectedBox: [],
      isCropping: false,
      cropRatio: 9/9,
      gender: null,
      marital: null,
      loading: false,
      error: false,
      controlsCloned: null,
    };
  },
  watch: {
    //   '$route': 'fetchForm'
  },
  created() {
      this.fetchForm();     
  },
  mounted(){

  },
  methods: {
        ...mapActions({
          createAccount: 'accounts/createAccount',
          getForm: 'accounts/getForm'
        }),
        updateControl(control){
           control.attributes.class = "form-control";
           control.attributes.hintclass = "form-text text-muted";
        },
        checker(control, value){
            control.value = value;        
        },
        fetchForm(){
            let vm = this;
            vm.loading = true;
            this.getForm({url: '/accounts/register'}).then(res =>{
                this.controls = sortObjects(res.data, 'order');              
                this.controlsCloned = sortObjects(res.data, 'order');              
                vm.loading = false;
            }).catch(err => {
                vm.error = err;
            });
        },
        register: function(e){
          let data = {};
          let vm = this;
          let button = document.getElementById('register');
          button.insertAdjacentHTML('beforebegin', '<i class="fa fa-refresh fa-spin" id="fa-register"></i>');
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
                for(var key in vm.controls){
                    if(res.data[key] !== undefined){
                        Object.keys(res.data[key]).forEach(ky => {
                            vm.controls[key].hint = res.data[key][ky];
                            if(vm.controls[key].type !== 'Radio'){
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
        cropImage(e){
            e.preventDefault();
            this.isCropping = false;
            this.showBtn = false;
            var image = this.$el.querySelector('.croppr-imageClipped');
            var tnCanvas = document.createElement('canvas');
            var tnCtx = tnCanvas.getContext('2d');
            var newWidth = this.selectedBox.x2 - this.selectedBox.x1;
            var newHeigth = this.selectedBox.y2 - this.selectedBox.y1;
            tnCanvas.width = (newWidth);          
            tnCanvas.height = (newHeigth);
            
            var bufferCanvas = document.createElement('canvas');
            var bufferCtx = bufferCanvas.getContext('2d');
            bufferCanvas.width = image.width;
            bufferCanvas.height = image.height;
            bufferCtx.drawImage(image, 0, 0);
            tnCtx.drawImage(bufferCanvas, 
                    this.selectedBox.x1, 
                    this.selectedBox.y1,
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
            passview.insertAdjacentElement('afterBegin', prevew);
        },
        selectImage: function(e){
            var imgPrevew = this.$el.querySelector('#prevew');
            if(imgPrevew){
                imgPrevew.parentNode.removeChild(imgPrevew);
            }            
            var elem = this;
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
                    console.log(img);
                    prevew.src = img.toDataURL("image/jpeg");  
                    prevew.style.display = 'block';
                    var croppr = new Croppr('#prevew', {
                        aspectRatio: elem.cropRatio,
                        onCropEnd: function(){
                           elem.selectedBox = croppr.box;                            
                        },
                        onInitialize: function(croppr){
                            elem.selectedBox = croppr.box;                            
                        }
                    });
                    elem.isCropping = true;
                    elem.showBtn = true;                     
                },
                {
                    maxHeight: 200,
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
.form-control {
    width: auto !important;
    border: 1px solid #c2afaf !important;
    border-radius: 0 !important;
    padding: 0.375rem 0.75rem !important;
}

.form-group {
    margin-bottom: 0.6rem;
}
.user-form{
    margin: 20px 0px;
}
.passport{
    position: relative;
}

#prevew{
    height: auto;
    width: 100px;
    border-radius: 50%;
}
button{
    margin-top: 4px;
}
.register{
    border-left: cadetblue solid thin;
    border-right: cadetblue solid thin;
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
   color: rgb(134, 10, 10) !important;
}
.spinner {
  margin: 100px auto 0;
  width: 70px;
  text-align: center;
}

.spinner > div {
  width: 18px;
  height: 18px;
  background-color: #333;

  border-radius: 100%;
  display: inline-block;
  -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  animation: sk-bouncedelay 1.4s infinite ease-in-out both;
}

.spinner .bounce1 {
  -webkit-animation-delay: -0.32s;
  animation-delay: -0.32s;
}

.spinner .bounce2 {
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;
}

@-webkit-keyframes sk-bouncedelay {
  0%, 80%, 100% { -webkit-transform: scale(0) }
  40% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bouncedelay {
  0%, 80%, 100% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 40% { 
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
  }
}
</style>
