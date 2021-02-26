import VueYouTubeEmbed from 'vue-youtube-embed';
import Vue from 'vue';

/*global Vue VueYouTubeEmbed:true*/
Vue.use(VueYouTubeEmbed.default);

window.app = new Vue({
    el: '#app',
    data: {
        videoId: 'M7lc1UVf-VE',
        nextId: '',
        videos: [],
        width: '640',
        height: '360',
    },
    methods: {
        pause: function() {
            this.player.pauseVideo();
        },
        next: function() {
            this.videoId = this.nextId;
            this.nextId = '';
        },
        add: function() {
            this.videos.push({ videoId: this.nextId });
            this.nextId = '';
        },
        remove: function() {
            this.videos.pop();
        },
    },
    components: {
        VideoList: {
            props: ['video'],
            data: function() {
                return {
                    log: [],
                };
            },
            filters: {
                url: VueYouTubeEmbed.getIdFromURL,
            },
            template: `
        <div>
          <h2>video: {{video}}</h2>
          <youtube :video-id="video | url"
            @ready="ready"
            @ended="ended"
            @playing="playing"
            @paused="paused"
            @buffering="buffering"
            @qued="qued">
          </youtube>
          <ol><li v-for="item in log">type: {{item.type}}</li></ol>
        </div>`,
            methods: (function() {
                var events = [
                    'ready',
                    'ended',
                    'playing',
                    'paused',
                    'buffering',
                    'qued',
                ];
                var methods = {};

                events.forEach(function(event) {
                    methods[event] = function(player) {
                        console.log({ type: event, player: player });
                        this.log.push({ type: event });
                    };
                });

                return methods;
            })(),
        },
    },
});
