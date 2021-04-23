import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import YouTubeIframeLoader from 'youtube-iframe';

class VideoBlock extends Component {
    constructor(nRoot) {
        super(nRoot, 'video-block');
        this.bgWrapper = this.nFindSingle('bg-wrapper');
        this.videoYT = this.nFindSingle('item_youtube');

        if (this.videoYT) {
            this.youtubeReady = this.youtubeReady.bind(this);
            this.onPlayerReady = this.onPlayerReady.bind(this);
            this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
            setTimeout(() => {
                this.youtubeReady(this.nRoot);
            }, 1);
        } else {
            this.videoPlay = this.videoPlay.bind(this);
            this.bgWrapper.addEventListener('click', this.videoPlay);
        }

        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);
    }

    initDesktop() {

    }

    initMobile() {

    }

    youtubeReady(item) {
        const video = item.querySelector('.video-block__item_youtube');
        const embed = video.getAttribute('data-embed');
        YouTubeIframeLoader.load((YT) => {
            this.player = new YT.Player(video.id ? video.id : video, {
                height: '100%',
                width: '100%',
                videoId: `${embed}`,
                playerVars: {
                    autoplay: 0,
                    rel: 0,
                    showinfo: 0,
                    controls: 1,
                    modestbranding: 1,
                },
                events: {
                    onReady: this.onPlayerReady,
                    onStateChange: this.onPlayerStateChange,
                },
            });
        });
    }

    onPlayerReady() {
        this.bgWrapper.addEventListener('click', () => {
            this.bgWrapper.classList.add('video-block__bg-wrapper_hide');
            this.player.playVideo();
        });
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.PLAYING) {
            this.nRoot.querySelector('.video-block__item_youtube').classList.add('video-block__item_active');
        }
        if (event.data === YT.PlayerState.PAUSED) {
            if (this.bgWrapper.classList.contains('video-block__bg-wrapper_hide')) {
                this.bgWrapper.classList.remove('video-block__bg-wrapper_hide');
                this.nRoot.querySelector('.video-block__item_youtube').classList.remove('video-block__item_active');
            }
        }
    }

    videoPlay() {
        this.videoInner = this.nFindSingle('item_inner');
        if (this.videoInner) {
            if (this.videoInner.paused) {
                this.videoInner.play();
                this.bgWrapper.classList.add('video-block__bg-wrapper_hide');
            } else {
                this.videoInner.pause();
                this.bgWrapper.classList.remove('video-block__bg-wrapper_hide');
            }
        }
    }

    pause() {
        this.videoInner = this.nFindSingle('item_inner');
        if (this.videoInner) {
            this.videoInner.pause();
            this.videoInner.currentTime = 0;
        } else {
            this.player.stopVideo();
            this.bgWrapper.classList.remove('video-block__bg-wrapper_hide');
            this.nFindSingle('item_youtube').classList.remove('video-block__item_active');
        }
    }

    afterResize() {
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'mobile') {
                this.destroyDesktop();
                this.initMobile();
            } else if (this.currentDevice === 'mobile') {
                this.destroyMobile();
                this.initDesktop();
            }
            this.currentDevice = getDeviceType();
        }
    }

    destroyDesktop() {

    }

    destroyMobile() {

    }

    destroy() {
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default VideoBlock;
