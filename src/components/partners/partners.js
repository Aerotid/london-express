import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class Partners extends Component {
    constructor(nRoot) {
        super(nRoot, 'partners');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.nSwiperContainer = this.nRoot.querySelector('.swiper-container');

        this.swiper = new Swiper(this.nSwiperContainer, {
            slidesPerView: 'auto',
            loop: true,
            speed: 2500,
            autoplay: {
                delay: 0,
                disableOnInteraction: false
            }
        });
    }

    initDesktop() {

    }

    initMobile() {

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
        if (this.swiper) this.swiper.destroy();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default Partners;
