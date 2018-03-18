<template>
  <div :class="colClass">
      <div class="card">
        <img v-if="content.image.top" :class="imageClass" :src="content.imageUrl" alt="">
        <div class="card-body">
            <h5 class="card-title">
                {{content.title}}
            </h5>
           <p class="card-text">{{content.content}}</p>
           <p class="card-text"><small class="text-muted">{{content.bottomline}}</small></p>
        </div>
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
      }
  }
};
</script>

<style lang="scss">
 
</style>