import Component from '../../common/js/component';
import throttle from 'lodash.throttle';
import {getDeviceType, emit, listen, unlisten, nFindComponents, Resize, nFindComponent} from '../../common/js/helpers';
import Lead from '../lead/lead';
import Swiper from 'swiper/dist/js/swiper.min';
import LazyLinePainter from 'lazy-line-painter/lib/lazy-line-painter-1.9.6.min';
import SiteAwards from "../site-awards/site-awards";

class SliderLead extends Component {
    constructor(nRoot) {
        super(nRoot, 'slider-lead');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.firstSlide = 0;

        this.throttleParallax = throttle(this.parallax, 100);
        this.nRoot.addEventListener('mousemove', this.throttleParallax, true);

        listen('mousestop', () => {
            this.nRoot.classList.remove('active');
            if (this.activeLead) this.activeLead.clearParallax();
            this.clearParallax();
        });

        if (nFindComponent('site-awards', this.nRoot)) {
            this.siteAwards = new SiteAwards(nFindComponent('site-awards', this.nRoot));
        }

        this.nSwiperContainer = this.nRoot.querySelector('.swiper-container');

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    parallax = (e) => {
        let speed = this.nFindSingle('images').getAttribute('data-speed');
        let x = ( ( 50 - ( (window.innerWidth/2) - e.clientX ) * (speed - (speed * 20 / 100)) ) / 100);
        let y = ( ( 50 - ( (window.innerHeight/2) - e.clientY ) * (speed - (speed * 20 / 100)) ) / 50);
        this.nFindSingle('images').style.transform = `translate3d(${x}px, ${y}px, 0)`;

        this.updateCursor();
    };

    swiperInit = () => {
        if (this.firstSlide === 0) {
            this.nRoot.classList.add('change-slide');
            if (this.siteAwards) this.siteAwards.setActive(this.swiper.activeIndex);
            setTimeout(
                () => {this.nRoot.classList.remove('change-slide');},
                6000
            );
        }
        this.swiper.slideTo(this.firstSlide);
        this.initLead();
        this.swiper.autoplay.start();
    };

    initLead = () => {
        this.activeLead = this.leads[this.swiper.activeIndex];
        this.activeLead.init();
        if(this.swiper.activeIndex === this.swiper.slides.length -1 ) this.paintMustache();

        if(this.swiper.activeIndex === 0 ) this.removeMustache();
    };

    removeLead = () => {
        if (this.swiper.activeIndex !== 0) {
            this.prevSlide = this.swiper.activeIndex - 1;
        } else {
            this.prevSlide = this.swiper.slides.length - 1;
        }
        this.leads[this.prevSlide].remove();
    };

    transitionStart = () => {
        this.initLead();
        if (this.siteAwards) this.siteAwards.setActive(this.swiper.activeIndex);
    };

    transitionEnd = () => {
        this.removeLead();
    };

    slideChangeTransitionStart = () => {
        this.nRoot.classList.add('change-slide');
    };

    slideChangeTransitionEnd = () => {
        setTimeout(
            () => {this.nRoot.classList.remove('change-slide');},
            6000
        );
    };

    paintMustache = () => {
        this.nRoot.classList.add('mustache');
        this.animMustache = new LazyLinePainter(this.nFindSingle('mustache g'), {"reverse": true, "ease":"easeLinear","strokeWidth":2,"strokeOpacity":1,"strokeColor":"#FFF","strokeCap":"square", "delay":500});
        this.animMustache.paint();
    };

    removeMustache = () => {
        this.nRoot.classList.remove('mustache');
        // this.animMustache.erase();
    };

    getRandomInt = (max) => {
        return Math.floor(Math.random() * Math.floor(max));
    };

    updateCursor = () => {
        if (!this.nRoot.classList.contains('active')) this.nRoot.classList.add('active');
        this.mouseStopDelay(1000);
    };

    mouseStopDelay = (time) => {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => { emit('mousestop'); }, time);
    };

    clearParallax = () => {
        this.nFindSingle('images').style.transform = `translate3d(0, 0, 0)`;
    };

    initDesktop() {
        this.leads = nFindComponents('lead').map(el => {
            const lead = new Lead(el);
            return lead;
        });
        this.firstSlide = this.getRandomInt(this.leads.length);
        this.leads[this.firstSlide].prepareSvg();

        this.swiper = new Swiper(this.nSwiperContainer, {
            slidesPerView: 1,
            slidesPerScroll: 1,
            autoplay: {
                delay: 10000,
            },
            updateOnWindowResize: true,
            noSwipingClass: '_no-swiping',
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            simulateTouch: true,
            preventInteractionOnTransition: true,
            allowTouchMove: false,
            observer: true,
            touchRatio: 1,
            // initialSlide: 1,
            init: false,

            on: {
                //init: this.swiperInit,
                transitionStart: this.transitionStart,
                transitionEnd: this.transitionEnd,
                slideChangeTransitionStart: this.slideChangeTransitionStart,
                slideChangeTransitionEnd: this.slideChangeTransitionEnd
            }
        });

        this.swiper.on('init', this.swiperInit);
        this.swiper.init();
    }

    initMobile() {
        this.swiper = new Swiper(this.nSwiperContainer, {
            slidesPerView: 1,
            slidesPerScroll: 1,
            autoplay: {
                delay: 10000,
            },
            updateOnWindowResize: true,
            noSwipingClass: '_no-swiping',
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            simulateTouch: true,
            preventInteractionOnTransition: true,
            allowTouchMove: false,
            observer: true,
            touchRatio: 1,
            on: {
                transitionStart: () => {
                    if (this.siteAwards) this.siteAwards.setActive(this.swiper.activeIndex);
                }
            }
            // initialSlide: 1,
            //init: false,
        });
        if (this.siteAwards) this.siteAwards.setActive(0);
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
        this.swiper.destroy();
    }

    destroyMobile() {
        this.swiper.destroy();
    }

    destroy() {
        if (this.leads) {
            this.leads.forEach(lead => lead.destroy());
        }
        this.nRoot.removeEventListener('mousemove', this.throttleParallax, false);
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default SliderLead;
