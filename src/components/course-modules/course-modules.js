import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class CourseModules extends Component {
    constructor(nRoot) {
        super(nRoot, 'course-modules');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.nContainer = this.nFindSingle('container');
        this.nWrapper = this.nFindSingle('wrapper');
        this.nModules = this.nFind('module');

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    addSwiperClasses() {
        this.nContainer.classList.add('swiper-container');
        this.nWrapper.classList.add('swiper-wrapper');
        this.nModules.forEach((slide) => slide.classList.add('swiper-slide'));
    }

    removeSwiperClasses() {
        this.nContainer.classList.remove('swiper-container');
        this.nWrapper.classList.remove('swiper-wrapper');
        this.nModules.forEach((slide) => slide.classList.remove('swiper-slide'));
    }

    initDesktop() {

    }

    initMobile() {
        this.addSwiperClasses();
        this.swiper = new Swiper(this.nContainer, {
            slidesPerView: 'auto',
            loop: true,
            speed: 2500,
            autoplay: {
                delay: 0,
                disableOnInteraction: false,
            }
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
        this.removeSwiperClasses();
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

export default CourseModules;
