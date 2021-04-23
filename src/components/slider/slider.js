import Swiper from 'swiper/dist/js/swiper.min';
import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, Resize,
} from '../../common/js/helpers';

class Slider extends Component {
    constructor(nRoot) {
        super(nRoot, 'slider');
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
            speed: 1300,
            autoHeight: true,
            navigation: {
                nextEl: '.btn-arrow_next',
                prevEl: '.btn-arrow_prev',
                disabledClass: 'btn-arrow_disabled'
            },
            pagination: {
                el: this.nFindSingle('pagination'),
                bulletClass: 'slider__pagination-bullet',
                bulletActiveClass: 'slider__pagination-bullet_active',
                clickable: true,
                renderBullet: function (index, className) {
                    return '<div class="' + className + '">' +
                        '<svg width="11" height="9" viewBox="0 0 11 9" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
                        '<path d="M10.9947 2.59708C11.1656 6.06179 7.14605 8.20259 5.49998 9C3.85391 8.20259 -0.165587 6.06179 0.00528266 2.59708C0.213444 -1.6238 5.50001 -0.192544 5.5 3.27806C5.49999 -0.192544 10.7866 -1.6238 10.9947 2.59708Z" fill="#FF798A"/>\n' +
                        '</svg></div>';
                },
            },

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

export default Slider;
