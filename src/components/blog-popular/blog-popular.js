import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class BlogPopular extends Component {
    constructor(nRoot) {
        super(nRoot, 'blog-popular');
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
            slidesPerScroll: 1,
            spaceBetween: 40,
            loop: true,
            speed: 1300,
            breakpoints: {
                // when window width is >= 320px
                1200: {
                    spaceBetween: 0,
                },
            },
            navigation: {
                nextEl: '.btn-arrow_next',
                prevEl: '.btn-arrow_prev',
                disabledClass: 'btn-arrow_disabled'
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
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default BlogPopular;
