import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class GreatOffers extends Component {
    constructor(nRoot) {
        super(nRoot, 'great-offers');
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
            slidesPerView: 1,
            slidesPerScroll: 1,
            spaceBetween: 40,
            // loop: true,
            speed: 1300,
            navigation: {
                nextEl: '.btn-arrow_next',
                prevEl: '.btn-arrow_prev',
                disabledClass: 'btn-arrow_disabled'
            },
            breakpoints: {
                768: {
                    spaceBetween: 20,
                }
            }
        });
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        if (this.swiper) this.swiper.destroy();
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

export default GreatOffers;
