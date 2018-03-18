<template>
<div :class="colClass">
    <div class="card mb-2">
    <img v-if="content.image.top" :class="imageClass" :src="content.imageUrl" alt="">
    <div v-if="content.overlay" class="card-img-overlay"> 
        <span class="badge badge-pill badge-danger">{{content.overlayText}}</span> 
    </div>
    <div class="card-body p-2">
        <div class="news-title">
            <h2 class="title-small">
                <a href="#">{{content.title}}</a>
            </h2>
        </div>
        <p v-if="content.content" class="card-text">{{content.content}}</p>
        <p class="card-text"><small class="text-time"><em>{{content.bottomline}}</em></small></p>    </div>
    <img v-if="content.image.middle" :src="content.imageUrl" :class="imageClass" alt="">
    <div v-if="content.image.middle" class="card-body">
        <h5 class="card-title">
            {{content.title}}
        </h5>
        <p class="card-text">{{content.content}}</p>
        <p class="card-text"><small class="text-muted">{{content.bottomline}}</small></p>
    </div>
    <img v-if="content.image.bottom" :src="content.imageUrl" :class="imageClass" alt="">
    </div>
</div>
</template>

<script>

export default {
  name: "card",
  props: ['content'],
  components: { },
  computed: {
      colClass(){
          return 'col-md-' + this.content.cols;
      },
      imageClass(){
          return 'img-fluid card-img-' + this.content.position;
      },
  }
};
</script>

<style lang="scss">
 
</style>