<template>
  <div style="margin-top: 5px; display: block;">
    <input ref="fileInput" style="display: none;" type="file" name="imagepost" @change="onFileSelected">
      <div ref="progress" style="display: flex; flex-wrap: wrap;">
        <div ref="prog" style="width:100px; display: none" class="prog-wrapper">
            <div class="prog">.</div>
        </div>       
        <i ref="close" class="fa fa-asterisk fa-fw" style="font-size: 18px; display: none; cursor: pointer;"></i>
      </div>
    <span class="fa fa-image" style="color: green; font-size: 20px; float: right; cursor: pointer; margin:10px 5px;" @click="selectFile"></span>
  </div>
</template>
<script>

import { mapActions } from 'vuex';
import loadImage from 'blueimp-load-image';
import * as lib from '@/lib/http';
import { logout } from '../../lib/Auth';
export default {
    props: ['clearEditor'],
    data(){
        return {
            selectedFiles: null,
            uploadPercentage: 0,
        }
    },
    created(){

    },
    mounted(){  
        this.getUnsaveImages({url: '/posts/create'}).then(res =>{
            res.data.images.forEach(item => {
                var progWrap = this.$refs.progress;
                var imag = document.createElement('img');
                imag.id = 'uploaded';
                imag.style.width = '100px';
                var prog = this.$refs.prog.cloneNode(true);
                var error = document.createElement('div');
                var close = this.$refs.close.cloneNode(true);
                close.addEventListener('click', e => {
                    this.removeUpload(e);
                });
                var wrap = document.createElement('span');
                this.addClass(wrap, 'wrap-upload');
                wrap.style.marginTop = '5px';
                wrap.style.borderBottom = '5px';
                wrap.style.marginRight = '5px';
                wrap.style.width = '100px';
                wrap.style.float = 'left';
                close.style.display = 'block';
                prog.style.display = 'block';
                wrap.appendChild(close);
                wrap.appendChild(prog);
                progWrap.appendChild(wrap);
                var imgNm = item.name;
                var imagid = imgNm.split('-')[0];
                this.$emit('addImages', imagid);
                imag.setAttribute('src', 'http://ugwumba.org/uploads/' + imgNm);
                wrap.appendChild(imag);
            });
        }).catch(err => {
            console.log('error occored: '+ err);            
        });
    },
    watch: {
      clearEditor(val){
          if(val){
              this.resetUpload();
          }
      }  
    },
    methods: {
        ...mapActions({
            getUnsaveImages: 'posts/getUnsaveImages'
        }),
        resetUpload(){
            var uploads = document.querySelectorAll('.wrap-upload');
            if(uploads.length){
                Array.prototype.forEach.call(uploads, function( node ) {
                    node.parentNode.removeChild(node);
                });
            }
        },
        selectFile(){
            this.$refs.fileInput.click();
        },
        onFileSelected(e){
           this.selectedFiles = e.target.files; 
           this.uploadImage();         
        },
        addClass(el, className){
            if (el.classList){
                el.classList.add(className);
            }else{
                el.className += ' ' + className;
            }
        },
        removeClass(el, className){
            if (el.classList){
                el.classList.remove(className);
            }else{
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        },
        removeUpload(e){
            var span = e.target.parentNode;
            var imag = span.lastChild;
            var fa = e.target;
            this.addClass(fa, 'fa-spin');
            var imagurl = imag.src.substr(imag.src.lastIndexOf('/')+1);
            var imagid = imagurl.split('-')[0];
            lib.XHR.post('/posts/delete-image', {image: imagid})
                .then(res => {
                    span.parentNode.removeChild(span);
                })
                .catch(err => {
                    span.parentNode.removeChild(span);
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
        uploadImage(){
            for(var i = 0; i < this.selectedFiles.length; i++){
                var elem = this;
                var progWrap = elem.$refs.progress;
                var imag = document.createElement('img');
                imag.id = 'uploaded';
                imag.style.width = '100px';
                var prog = this.$refs.prog.cloneNode(true);
                var error = document.createElement('div');
                var close = elem.$refs.close.cloneNode(true);
                close.addEventListener('click', function(e){
                    elem.removeUpload(e);
                });
                var wrap = document.createElement('span');
                this.addClass(wrap, 'wrap-upload');
                wrap.style.marginTop = '5px';
                wrap.style.borderBottom = '5px';
                wrap.style.marginRight = '5px';
                wrap.style.width = '100px';
                wrap.style.float = 'left';
                close.style.display = 'block';
                prog.style.display = 'block';
                wrap.appendChild(close);
                wrap.appendChild(prog);
                progWrap.appendChild(wrap);

                var loadingImage = loadImage(
                    elem.selectedFiles[i],
                    function (img) {
                    var blob = elem.dataURLtoBlob(img.toDataURL("image/jpeg")); 
                    lib.XHR.post('posts/image', lib.FDT({"imagepost" : blob}), {
                        onUploadProgress: function(uploadEvent){
                            prog.lastChild.style.width = parseInt(Math.round((uploadEvent.loaded * 100)/uploadEvent.total)) + '%';
                            prog.lastChild.innerHTML = parseInt(Math.round((uploadEvent.loaded * 100)/uploadEvent.total)) + '%';
                       }
                    })
                    .then(res => {
                        if(res.data.filename){
                            var imgNm = res.data.filename;
                            var imagid = imgNm.substr(imgNm.lastIndexOf('/')+1).split('-')[0];
                            elem.$emit('addImages', imagid);
                            imag.setAttribute('src', 'http://ugwumba.org/'+res.data.filename);
                            wrap.appendChild(imag);
                        }else{
                            for(var k in res.data){
                                let txt = document.createTextNode(res.data[k]);
                                error.appendChild(txt);
                            }
                            error.style.display = 'block';
                            wrap.appendChild(error);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });               
                },
                {
                    canvas: true,
                    pixelRatio: window.devicePixelRatio,
                    downsamplingRatio: 0.3,
                    orientation: true
                });
            }
        },
    }
}
</script>
<style lang="scss">
    .prog{
        background-color: #000; 
        font-size: 4px;
        width: 0%;
        // display: inline-block;
    }
    .prog-wrapper{
        position: relative;
        margin-bottom: 5px;
        display: inline-block;  
        background-color: rgb(208, 168, 231);
    }
</style>

