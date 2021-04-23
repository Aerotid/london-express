import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize, vhMobileFix, delay,
} from '../../common/js/helpers';
import Btn from '../btn/btn';
import 'svg-dataset-polyfill';
import throttle from 'lodash/throttle';

class Lead2 extends Component {
    constructor(nRoot, opacity = 1, strokeColor = '#FFFFFF', leadType = 'scale') {
        super(nRoot, 'lead-2');
        this.opacity = opacity;
        this.strokeColor = strokeColor;
        this.leadType = leadType;
        this.delayLetter = 0;
        this.delaySvg = 500;

        this.nFigure = this.nFindSingle('figure img');
        this.nShadow = this.nFindSingle('shadow img');
        this.nGradient = this.nFindSingle('gradient img');

        this.description = this.nFindSingle('description');
        this.btn = this.nRoot.querySelector('.btn');
        if (nFindComponent('btn', this.nRoot)) {
            this.btn = new Btn(nFindComponent('btn', this.nRoot));
        }
        this.animateText = this.animateText.bind(this);

        this.nSvg = [...this.nFind('svg')];
        this.initAnimSvg = this.initAnimSvg.bind(this);


        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);
        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
            //this.animateText();
            //this.nRoot.classList.add('animation');
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    imageLoaded(image) {
        return image ? new Promise((resolve) => {
            if (image.complete) {
                resolve();
            } else {
                image.addEventListener('load', resolve);
                image.addEventListener('error', resolve);
            }
        }) : undefined;
    }

    imageLoadedHandler(nImage) {
        nImage.parentNode.classList.add('loaded');
    }

    animateFigure(type) {
        switch (type) {
        case 'teachers':
            const options = {
                ease: 'easeLinear',
                strokeWidth: 2,
                strokeOpacity: this.opacity,
                strokeColor: this.strokeColor,
                strokeCap: 'round',
            };
            const flyLines = this.nSvg[0];
            new LazyLinePainter(flyLines, options).paint();

            const tl = new TimelineMax();
            tl.staggerFromTo([this.nFigure, flyLines], 0.8, { yPercent: 100, xPercent: -20 },
                {
                    yPercent: 0,
                    xPercent: 0,
                    ease: Power4.easeOut
                });
            this.nSvg.shift();
            break;
        case 'bottom-up':
            TweenMax.staggerFromTo([this.nFigure], 0.8, { yPercent: 100 },
                {
                    yPercent: 0,
                    ease: Power4.easeOut,
                });
            break;
        case 'about':
            TweenMax.staggerFromTo([this.nFigure], 0.8, { scale: 0.5 },
                {
                    scale: 1,
                    ease: Power4.easeOut,
                     transformOrigin: '69% 52%'
                });
            break;
        case 'scale':
            TweenMax.staggerFromTo([this.nFigure], 0.8, { scale: 0.9 },
                {
                    scale: 1,
                    ease: Power4.easeOut,
                    transformOrigin: '69% 52%'
                });
            break;
        default:
            break;
        }
    }

    initAnimSvg(svgArray, startDelay) {
        this.myAnimation = [];
        try {
            svgArray.map((svg, i) => {
                const options = {
                    reverse: true,
                    ease: 'easeLinear',
                    strokeWidth: 2,
                    strokeOpacity: this.opacity,
                    strokeColor: this.strokeColor,
                    strokeCap: 'round',
                    delay: startDelay,
                };
                this.myAnimation[i] = new LazyLinePainter(svg, options);
                startDelay += 250;
            });
        } catch (e) {
            this.fillSvg(svgArray);
        }
    }

    fillSvg() {
        this.nSvg.forEach((svg) => {
            svg.style.stroke = this.strokeColor;
            svg.style.strokeOpacity = this.opacity;
            svg.style.strokeWidth = 2;
        });
    }

    animateText() {
        this.title = this.nFindSingle('title');
        this.title.innerHTML = this.title.innerHTML.replace(/[^<br>|\s](?:(?!<br>)\S)*/g, '<span class=\'word\'>$&</span>');
        [...this.title.querySelectorAll('.word')].forEach((word) => {
            word.innerHTML = word.innerHTML.replace(/\S/g, '<span class=\'letter\'>$&</span>');
        });

        const letters = this.title.querySelectorAll('.letter');
        const speed = letters.length < 30 ? 0.05 : 0.04;
        [...letters].forEach((letter) => {
            letter.style.animationDelay = `${this.delayLetter}s`;
            this.delayLetter += speed;
        });
    }

    parallax = (e) => {
        [...this.nRoot.querySelectorAll('[data-speed]')].forEach(layer => {
            let speed = layer.getAttribute('data-speed');
            let x = ( ( 50 - ( (window.innerWidth/2) - e.clientX ) * (speed - (speed * 20 / 100)) ) / 100);
            let y = ( ( 50 - ( (window.innerHeight/2) - e.clientY ) * (speed - (speed * 20 / 100)) ) / 50);
            if (layer.getAttribute('data-bottom')) y = Math.max(0, y);
            layer.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
    };

    clearParallax = () => {
        [...this.nRoot.querySelectorAll('[data-speed]')].forEach(layer => {
            layer.style.transform = `translate3d(0, 0, 0)`;
        });
    };

    initDesktop() {
        Promise.all([
            this.imageLoaded(this.nFigure),
            this.imageLoaded(this.nShadow)]
        ).then(() => {
            if (this.leadType) this.animateFigure(this.leadType);
            this.nRoot.classList.add('figure-appear');
            this.initAnimSvg(this.nSvg, this.delaySvg + this.delayLetter);
            this.myAnimation.forEach((anim) => anim.paint());
        })
            .then(() => delay(500))
            .then(() => {
                if (this.nSvg) {
                    //this.initAnimSvg(this.nSvg, this.delaySvg + this.delayLetter);
                    //this.myAnimation.forEach((anim) => anim.paint());
                    this.nRoot.classList.add('animation');
                }
                this.animateText();
                this.throttleParallax = throttle(this.parallax, 100);
                this.nRoot.addEventListener('mousemove', this.throttleParallax, true);
                listen('mousestop', this.clearParallax);
            });
    }

    initMobile() {
        Promise.all([
            this.imageLoaded(this.nFigure),
            this.imageLoaded(this.nShadow)]
        ).then(() => {
            this.nRoot.classList.add('figure-appear');
        });
    }

    afterResize() {
        vhMobileFix();

        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'mobile') {
                this.destroyDesktop();
                this.initMobile();
            } else if (this.currentDevice === 'mobile') {
                this.destroyMobile();
                //this.initDesktop();
                this.nRoot.classList.add('visible');
            }
            this.currentDevice = getDeviceType();
        }
    }

    destroyDesktop() {

    }

    destroyMobile() {

    }

    destroy() {
        this.nRoot.classList.remove('animation');
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default Lead2;
