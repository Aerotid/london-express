import Swiper from 'swiper/dist/js/swiper.min';
import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize,
} from '../../common/js/helpers';

class ClassFormat extends Component {
    constructor(nRoot, paginationType = 'bullets') {
        super(nRoot, 'class-format');

        this.paginationType = paginationType;
        this.pagination = {};
        this.scrollbar = {};

        switch (paginationType) {
        case 'bullets':
        default:
            this.pagination = {
                el: this.nFindSingle('pagination'),
                bulletClass: 'class-format__pagination-bullet',
                bulletActiveClass: 'class-format__pagination-bullet_active',
                clickable: true,
                type: 'bullets',
                renderBullet: (index, className) => `<div class="${className}"></div>`,
            };
            this.nRoot.querySelector('.swiper-custom-scrollbar').style.display = 'none';
            break;
        case 'scrollbar':
            this.scrollbar = {
                el: this.nRoot.querySelector('.swiper-custom-scrollbar'),
                dragClass: 'swiper-custom-scrollbar-drag',
                draggable: true,
                hide: false,
            };
            this.nFindSingle('pagination').style.display = 'none';
            break;
        }

        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    initDesktop() {
        this.swiper = new Swiper(this.nRoot.querySelector('.swiper-container'), {
            slidesPerView: 1,
            slidesPerScroll: 1,
            loop: true,
            navigation: {
                nextEl: '.btn-arrow_next',
                prevEl: '.btn-arrow_prev',
                disabledClass: 'btn-arrow_disabled',
                clickable: 'true',
            }
        });
    }

    initMobile() {
        this.swiper = new Swiper(this.nRoot.querySelector('.swiper-container'), {
            slidesPerView: 1,
            slidesPerScroll: 1,
            loop: this.paginationType !== 'scrollbar',
            pagination: this.pagination,
            scrollbar: this.scrollbar,
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
        if (this.swiper) this.swiper.destroy();
    }

    destroyMobile() {
        if (this.swiper) this.swiper.destroy();
    }

    destroy() {
        if (this.swiperClass) this.swiperClass.destroy();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default ClassFormat;
