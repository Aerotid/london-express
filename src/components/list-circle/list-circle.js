import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';
import Btn from '../btn/btn';

class ListCircle extends Component {
    constructor(nRoot) {
        super(nRoot, 'list-circle');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    initDesktop() {

    }

    initMobile() {
        this.nSwiperContainer = this.nFindSingle('swiper-container');

        this.swiper = new Swiper(this.nSwiperContainer, {
            slidesPerView: 1,
            slidesPerScroll: 1,
            slideClass: 'list-circle__swiper-slide',
            wrapperClass: 'list-circle__swiper-wrapper',
            scrollbar: {
                el: this.nRoot.querySelector('.swiper-custom-scrollbar'),
                dragClass: 'swiper-custom-scrollbar-drag',
                draggable: true,
                hide: false,
            },
        });
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
        if (this.swiper) this.swiper.destroy();
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

export default ListCircle;
