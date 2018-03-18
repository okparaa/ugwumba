<template>
  <div>
    <div class="row">
      <div class="col-md-6">
        <div class="row">
        <carousel></carousel>
        </div>
      </div>
      <div class="col-md-6">
        <div class="row">
        <x-card :content="content"></x-card>
        <x-card :content="content"></x-card>
        </div>
      </div>
    </div>
    <gallery></gallery>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { XCard, Carousel, Gallery } from '../../components';

export default {
  name: 'home',
  components: {
    'x-card': XCard,
    'carousel': Carousel,
    'gallery': Gallery
  },
  data () {
    return {
      content: {
        cols: 6,
        content: '',
        imageUrl: "static/images/ship.jpg",
        title: 'The worst songs about business reviews',
        position: 'top',
        bottomline: 'Last updated 3 mins ago',
        image: {
          top: true,
          middle: false,
          bottom: false
        }
      }
    };
  },

  mounted () {
    
  },

  methods: {
    ...mapActions([
      'deleteAccount'
    ]),

    confirmDeleteAccount (account) {
      if (confirm(`Are you sure you want to delete ${account.name}?`)) {
        this.deleteAccount(account);
      }
    }
  },

  computed: {
    ...mapState({
      'accounts': state => state.accounts.accounts
    })
  }
};
</script>

<style scoped lang='scss'>

</style>
