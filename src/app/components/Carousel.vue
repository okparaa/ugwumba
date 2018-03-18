<template>
    <div class="col-md-12 top-slider card">
        <div id="carousel-example-generic" class="carousel slide" data-ride="carousel"> 
        <!-- Indicators -->
        <ol class="carousel-indicators">
        <li data-target="#carousel-example-generic" data-slide-to="0" class=""></li>
        <li data-target="#carousel-example-generic" data-slide-to="1" class="active"></li>
        <li data-target="#carousel-example-generic" data-slide-to="2" class=""></li>
        </ol>

        <!-- Wrapper for slides -->
        <div class="carousel-inner" role="listbox">
            <div class="carousel-item">
            <div class="news-block">
                <div class="news-media"><img class="img-fluid" src="@/images/sport1.jpg" alt=""></div>
                <div class="news-title">
                <h2 class=" title-large"><router-link :to="{}">Ray madison may struggle to get best from Paul in a 4-2-3-1 formation</router-link></h2>
                </div>
                <div class="news-des">Condimentum ultrices mi est a arcu at cum a elementum per cum turpis dui vulputate vestibulum in vehicula montes vel. Mauris nam suspendisse consectetur mus...</div>
                <div class="time-text"><strong>2h ago</strong></div>
            </div>
            </div>
            <div class="carousel-item active">
            <div class="news-block">
                <div class="news-media"><img class="img-fluid" src="@/images/health.jpg" alt=""></div>
                <div class="news-title">
                <h2 class=" title-large"><router-link :to="{}">An Alternative Form of Mental Health Care Gains a Foothold</router-link></h2>
                </div>
                <div class="news-des">Condimentum ultrices mi est a arcu at cum a elementum per cum turpis dui vulputate vestibulum in vehicula montes vel. Mauris nam suspendisse consectetur mus...</div>
                <div class="time-text"><strong>2h ago</strong></div>
            </div>
            </div>
            <div class="carousel-item">
            <div class="news-block">
                <div class="news-media"><img class="img-fluid" src="@/images/politics1.jpg" alt=""></div>
                <div class="news-title">
                <h2 class=" title-large"><router-link :to="{}">Key Republican Senator Says She Will Not Vote for former president!</router-link></h2>
                </div>
                <div class="news-des">Condimentum ultrices mi est a arcu at cum a elementum per cum turpis dui vulputate vestibulum in vehicula montes vel. Mauris nam suspendisse consectetur mus...</div>
                <div class="time-text"><strong>2h ago</strong></div>
            </div>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "card",
  props: [''],
  components: { },
  computed: {
  }
};
</script>

<style lang="scss">
 
</style>