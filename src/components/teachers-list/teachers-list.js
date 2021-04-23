import Swiper from 'swiper/dist/js/swiper.min';
import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize,
} from '../../common/js/helpers';

class TeachersList extends Component {
    constructor(nRoot) {
        super(nRoot, 'teachers-list');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.nSwiperContainer = this.nRoot.querySelector('.swiper-container');
        this.nSwiperWrapper = this.nRoot.querySelector('.swiper-wrapper');
        this.nSwiperSlides = [...this.nRoot.querySelectorAll('.swiper-slide')];

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    addSwiperClasses() {
        this.nSwiperContainer.classList.add('swiper-container');
        this.nSwiperWrapper.classList.add('swiper-wrapper');
        this.nSwiperSlides.forEach((slide) => slide.classList.add('swiper-slide'));
    }

    removeSwiperClasses() {
        this.nSwiperContainer.classList.remove('swiper-container');
        this.nSwiperWrapper.classList.remove('swiper-wrapper');
        this.nSwiperSlides.forEach((slide) => slide.classList.remove('swiper-slide'));
    }

    initDesktop() {
        this.removeSwiperClasses();
    }

    initMobile() {
        this.addSwiperClasses();
        this.swiper = new Swiper(this.nSwiperContainer, {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 30,
            scrollbar: {
                el: this.nRoot.querySelector('.swiper-custom-scrollbar'),
                dragClass: 'swiper-custom-scrollbar-drag',
                draggable: true,
                hide: false,
                dragSize: 88,
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
        this.removeSwiperClasses();
    }

    destroyMobile() {
        this.addSwiperClasses();
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

export default TeachersList;
