import Swiper from 'swiper/dist/js/swiper.min';
import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize,
} from '../../common/js/helpers';

class SliderLevels extends Component {
    constructor(nRoot) {
        super(nRoot, 'slider-levels');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.nSwiperContainer = this.nRoot.querySelector('.swiper-container');

        this.nLevels = this.nFind('level');
        this.nLevelsContainer = this.nFindSingle('levels-container');
        this.nLevelsWrapper = this.nFindSingle('levels');
        this.nDrag = this.nFindSingle('drag');

        if (getDeviceType() !== 'desktop') {
            this.initTabletMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    hasSingleSlide() {
        return this.nFind('level').length === 1;
    }

    setLevelsWidth() {
        const containerWidth = +getComputedStyle(this.nSwiperContainer).width.match(/\d+/g)[0];
        const countLevels = this.nLevels.length;
        this.nLevels.forEach((level) => {
            level.style.width = `${containerWidth / countLevels}px`;
        });
    }

    resetLevelsWidth() {
        this.nLevels.forEach((level) => {
            level.style.width = '';
        });
    }

    initDesktop() {
        if (this.hasSingleSlide()) {
            this.nRoot.classList.add('slider-levels_single-slide');
        } else {
            this.swiper = new Swiper(this.nSwiperContainer, {
                slidesPerScroll: 1,
                autoHeight: true,
                scrollbar: {
                    el: '.slider-levels__scrollbar',
                    dragClass: 'slider-levels__drag',
                    draggable: true,
                    hide: false,
                    // dragSize: 155,
                },
            });
            this.setLevelsWidth();
        }
    }

    initTabletMobile() {
        if (this.hasSingleSlide()) {
            this.nRoot.classList.add('slider-levels_single-slide');
        } else {
            this.swiper = new Swiper(this.nSwiperContainer, {
                slidesPerScroll: 1,
                autoHeight: true,
            });

            this.nLevelsContainer.classList.add('swiper-container');
            this.nLevelsWrapper.classList.add('swiper-wrapper');
            this.nLevels.forEach((level) => {
                level.classList.add('swiper-slide');
            });

            this.swiperLevels = new Swiper(this.nLevelsContainer, {
                slidesPerScroll: 1,
                slidesPerView: 'auto',
                centeredSlides: true,
                wrapperClass: 'slider-levels__levels',
                slideClass: 'slider-levels__level',
            });

            this.swiper.controller.control = this.swiperLevels;
            this.swiperLevels.controller.control = this.swiper;
        }
    }

    afterResize() {
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'desktop') {
                this.destroyTabletMobile();
                this.initDesktop();
            } else if (this.currentDevice === 'desktop') {
                this.destroyDesktop();
                this.initTabletMobile();
            }
            this.currentDevice = getDeviceType();
        }
    }

    destroyDesktop() {
        this.swiper.destroy();
        this.resetLevelsWidth();
        this.nDrag.removeAttribute('style');
    }

    destroyTabletMobile() {
        this.swiper.destroy();
        this.swiperLevels.destroy();

        this.nLevelsContainer.classList.remove('swiper-container');
        this.nLevelsWrapper.classList.remove('swiper-wrapper');
        this.nLevels.forEach((level) => {
            level.classList.remove('swiper-slide');
        });
    }

    destroy() {
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile' || getDeviceType() === 'tablet') {
            this.destroyTabletMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default SliderLevels;
