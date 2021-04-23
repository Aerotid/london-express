import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class SliderAchievements extends Component {
    constructor(nRoot) {
        super(nRoot, 'slider-achievements');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.swiperAchievements = new Swiper('.swiper-container', {
            slidesPerView: 2,
            spaceBetween: 80,
            breakpoints: {
                1200: {
                    spaceBetween: 40,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                },
            },
            navigation: {
                nextEl: '.btn-arrow_next',
                prevEl: '.btn-arrow_prev',
                disabledClass: 'btn-arrow_disabled',
                clickable: 'true',
            },
            scrollbar: {
                el: this.nRoot.querySelector('.swiper-custom-scrollbar'),
                dragClass: 'swiper-custom-scrollbar-drag',
                draggable: true,
                hide: false,
            },
        });

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
        if (this.swiperAchievements) this.swiperAchievements.destroy();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default SliderAchievements;
