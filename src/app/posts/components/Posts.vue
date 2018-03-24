<template>
<div v-cloak>
    <div class="col-lg-3 col-md-2">
    </div>
    <div class="col-lg-6 col-md-8 row-quill">
        <file-upload @addImages="addImages" :clearEditor="clearEditor"></file-upload>
        <div id="text-container" class="ui attached segment editor-container" ref="quill" @click.prevent="focusEditor"></div>
        <button @click="sendPost" class="btn btn-sm btn-primary mt-1">Send Post</button>
    </div>
</div>
</template>
<script>
    import Quill from 'quill';
    import Upload from '@/app/components/Upload';
    import { mapActions } from 'vuex';
    export default {
        data() {
            return {
                editor: {},
                content: {},
                author: {},
                formats: [],
                images: [],
                clearEditor: false,
                keyBindings: [],
                output: 'delta',
                keyup: null,
                config: {
                    modules: {
                        toolbar: [
                            [{ header: [1, 2, false] }],
                            ['bold', 'italic', 'underline'],
                            //['image', 'code-block']
                        ]
                    },
                    theme: 'snow',
                },
            }
        },
        mounted() {
            this.editor = new Quill(this.$refs.quill, this.config);
            this.formats.map((format) => {
                this.editor.addFormat(format.name, format.options);
            });
            this.editor.setContents(this.content);
            this.editor.on('text-change', (delta, source) => {
                this.$emit('text-change', this.editor, delta, source);
                this.content = this.editor.getContents();
            });
            this.editor.on('selection-change', (range) => {
                this.$emit('selection-change', this.editor, range);
            });
            if (this.keyBindings.length) {
                const keyboard = this.editor.getModule('keyboard')
                this.keyBindings.map((binding) => {
                    keyboard.addHotkey({ key: binding.key, metaKey: true }, binding.method.bind(this))
                })
            }
        },
        methods: {
            ...mapActions({
                createPosts: 'posts/create',
                getImagesWithNoContent: 'posts/getImagesWithNoContent'
            }),

            addImages(image){
                this.images.push(image);                
            },
            focusEditor(e) {
                if (e && e.srcElement) {
                    let classList = e.srcElement.classList, isSegment = false;
                    classList.forEach((className) => {
                        if (className === 'segment') {
                            isSegment = true
                            return
                        }
                    })
                    if (!isSegment) return;
                }
                this.editor.focus()
                this.editor.setSelection(this.editor.getLength()-1, this.editor.getLength())
            },
            sendPost(){
                var elem = this;                
                this.createPosts({url: '/posts/create', data: { 
                        content: this.editor.root.innerHTML,
                        images: this.images.join('&') 
                    }})
                    .then(res => {
                        if(res.data.message == 'success'){
                            elem.images = [];
                            elem.clearEditor = true;
                            elem.editor.setContents([]);
                        }
                        console.log(res.data);
                    })
                    .catch(err =>{
                        console.log(err);
                    });               
            }
        },
        components:{
            'file-upload': Upload
        }
    }
</script>

<style lang="scss">
  .text-container {
      height: 150px;
  }
  @import '../../../../node_modules/quill/dist/quill.core.css';
  @import '../../../../node_modules/quill/dist/quill.snow.css';
div.row-quill {
    margin: auto;
    
}
[v-cloak]{
    display: none;
}
.ql-container {
    font-size: 16px;
}
</style>