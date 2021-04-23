import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import Swiper from 'swiper/dist/js/swiper.min';

class PriceSlider extends Component {
    constructor(nRoot) {
        super(nRoot, 'price-slider');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (this.nFindSingle('tabs')) {
            this.tabs = this.nFindSingle('tabs');

            this.nFind('tab').forEach(tab => {
                tab.addEventListener('click', () => {
                    this.change(event, tab);
                }, true);
            });

            this.init();
        }
    }

    init = () => {
        this.setActiveOption();
        if (this.tabTeacher == 0 && this.tabDuration == 0 && this.tabStudent == 0) {
            this.nSwiperContainer = this.nRoot.querySelector('[data-slider="1"]');
        } else if (this.tabTeacher == 0 && this.tabDuration == 1 && this.tabStudent == 0) {
            this.nSwiperContainer = this.nRoot.querySelector('[data-slider="2"]');
        } else if (this.tabTeacher == 0 && this.tabDuration == 0 && this.tabStudent == 1) {
            this.nSwiperContainer = this.nRoot.querySelector('[data-slider="3"]');
        } else if (this.tabTeacher == 0 && this.tabDuration == 1 && this.tabStudent == 1) {
            this.nSwiperContainer = this.nRoot.querySelector('[data-slider="4"]');
        } else if (this.tabTeacher == 1 && this.tabDuration == 0) {
            this.nSwiperContainer = this.nRoot.querySelector('[data-slider="5"]');
        } else if (this.tabTeacher == 1 && this.tabDuration == 1) {
            this.nSwiperContainer = this.nRoot.querySelector('[data-slider="6"]');
        }
        this.initSlider(this.nSwiperContainer);
    };

    change = (e, tab) => {
        if (!e.target.classList.contains('price-slider__tab-btn')) return;

        tab.querySelector('button.active').classList.remove('active');
        if (e.target.hasAttribute('data-option')) {
            e.target.classList.add('active');
            this.init();
        }
    };

    setActiveOption() {
        this.tabTeacher = this.tabs.querySelector('[data-tab="0"] .active').getAttribute('data-option');
        this.tabDuration = this.tabs.querySelector('[data-tab="1"] .active').getAttribute('data-option');
        this.tabStudent = this.tabs.querySelector('[data-tab="2"] .active').getAttribute('data-option');
    }

    initSlider(container) {
        if (container) {
            if (this.swiper) this.swiper.destroy();
            if (this.nRoot.querySelector('.price-slider__container.active')) {
                this.nRoot.querySelector('.price-slider__container.active')
                    .classList
                    .remove('active');
            }

            container.classList.add('active');
            this.swiper = new Swiper(container, {
                slidesPerView: 'auto',
                speed: 1300,
            });
        }
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

export default PriceSlider;
