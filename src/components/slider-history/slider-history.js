import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class SliderHistory extends Component {
    constructor(nRoot) {
        super(nRoot, 'slider-history');

        this.nSwiperContainer = this.nRoot.querySelector('.swiper-container');

        this.swiper = new Swiper(this.nSwiperContainer, {
            slidesPerView: 'auto',
            scrollbar: {
                el: '.swiper-custom-scrollbar',
                dragClass: 'swiper-custom-scrollbar-drag',
                draggable: true,
                hide: false,
                dragSize: 88,
            },
        });

        this.snapGridLength = this.swiper.snapGrid.length;
        this.swiper.snapGrid = [...this.swiper.slidesGrid];
        this.swiper.pagination.update();
        this.swiper.on('slideChange', this.slideChangeHandler);

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

    slideChangeHandler = () => {
        if (this.snapGridLength === this.swiper.snapGrid.length) {
            this.swiper.snapGrid = [...this.swiper.slidesGrid];
        }
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        if (this.swiper) {
            this.swiper.update();
            this.swiper.snapGrid = [...this.swiper.slidesGrid];
        }

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
        if (this.swiper) this.swiper.destroy();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default SliderHistory;
