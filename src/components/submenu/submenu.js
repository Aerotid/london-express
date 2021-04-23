import Swiper from 'swiper/dist/js/swiper.min';
import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';

class Submenu extends Component {
    constructor(nRoot) {
        super(nRoot, 'submenu');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.swiper = new Swiper(this.nRoot, {
            slideToClickedSlide: true,
            touchRatio: 0.2,
            freeMode: true,
            freeModeSticky: true,
            slidesPerView: 'auto',
            longSwipes: false,
            observer: true,
            observeParents: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            init: false,
            speed: 400,
        });
        this.swiper.init();

        // убираем половинки слов в навигации
        const updateGrid = () => {
            if (this.swiper.snapGrid > this.swiper.slidesGrid) {
                const length = this.swiper.snapGrid.length - this.swiper.slidesGrid.length;
                this.swiper.snapGrid.splice(this.swiper.snapGrid.length - length, length);
            }

            const lastGrid = this.swiper.slidesGrid[this.swiper.snapGrid.length - 1];

            this.swiper.snapGrid.pop();
            this.swiper.snapGrid.push(lastGrid);
        };

        this.swiper.on('slideNextTransitionEnd', () => {
            updateGrid();
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

export default Submenu;
