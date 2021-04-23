import LazyLinePainter from '../../../node_modules/lazy-line-painter/lib/lazy-line-painter-1.9.6.min';
import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize, delay } from '../../common/js/helpers';
import throttle from 'lodash.throttle';
import 'svg-dataset-polyfill';
import 'svg-classlist-polyfill';

class Lead extends Component {
    constructor(nRoot) {
        super(nRoot, 'lead');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);
        this.delayLetter = 0;
        this.isSvgPrepared = false;

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }

        this.title = this.nFindSingle('title');
        this.nSvgGroups = this.nFind('svg g');

        if (!this.title.querySelector('.word .letter')) {
            this.title.innerHTML = this.title.innerHTML.replace(/\S+/g, "<span class='word'>$&</span>");
            [...this.title.querySelectorAll('.word')].forEach(word => {
                word.innerHTML = word.innerHTML.replace(/\S/g, "<span class='letter'>$&</span>");
            });

            [...this.title.querySelectorAll('.letter')].forEach(letter => {
                letter.style.animationDelay = `${this.delayLetter}s`;
                this.delayLetter = this.delayLetter + 0.05;
            });
        }


        this.delaySvg = 500;
        this.myAnimation = [];

        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    prepareSvg() {
        this.nSvgGroups.map((svg, i) => {
            this.myAnimation[i] = new LazyLinePainter(svg, {
                "reverse": true,
                "ease":"easeLinear",
                "strokeWidth":2,
                "strokeOpacity":1,
                "strokeColor":"#FFF",
                "strokeCap":"square",
                "delay": this.delaySvg + this.delayLetter
            });
            this.delaySvg += 250;
        });
        this.isSvgPrepared = true;
    }

    initDesktop = () => {

    };

    initMobile = () => {
        this.nRoot.classList.add('visible');
    };

    init = () => {
        if(!this.isSvgPrepared) this.prepareSvg();
        this.myAnimation.forEach((anim) => anim.paint());
        this.nRoot.classList.add('animation');

        this.throttleParallax = throttle(this.parallax, 100);
        this.nRoot.addEventListener('mousemove', this.throttleParallax, true);
    };

    remove = () => {
        this.nRoot.classList.remove('animation');
        this.nRoot.removeEventListener('mousemove', this.parallax, false);
        // this.myAnimation.forEach(anim => {
        //     anim.erase();
        // });
    };

    parallax = (e) => {
        [...this.nRoot.querySelectorAll('[data-speed]')].forEach(layer => {
            let speed = layer.getAttribute('data-speed');
            let x = ( ( 50 - ( (window.innerWidth/2) - e.clientX ) * (speed - (speed * 20 / 100)) ) / 100);
            let y = ( ( 50 - ( (window.innerHeight/2) - e.clientY ) * (speed - (speed * 20 / 100)) ) / 50);
            layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    };

    clearParallax = () => {
        [...this.nRoot.querySelectorAll('[data-speed]')].forEach(layer => {
            layer.style.transform = `translate3d(0, 0, 0)`;
        });
    };

    afterResize = () => {
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
    };

    destroyDesktop = () => {

    };

    destroyMobile = () => {

    };

    destroy = () => {
        this.nRoot.removeEventListener('mousemove', this.throttleParallax, false);
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    };
}

export default Lead;
