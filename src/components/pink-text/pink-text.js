import { CountUp } from 'countup.js';
import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize,
} from '../../common/js/helpers';
import { initAnim, destroyAnim } from './animations';

class PinkText extends Component {
    constructor(nRoot, isCountedUp = true) {
        super(nRoot, 'pink-text');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);
        this.suffix = this.nFindSingle('title').getAttribute('data-suffix');
        const endVal = +this.nFindSingle('title').innerText;
        const startVal = endVal > 100 ? Math.floor(endVal * 0.7) : 0;
        const options = {
            useGrouping: true,
            suffix: this.suffix,
            startVal: startVal,
            duration: 1,
            separator: ' ',
        };

        if (isCountedUp) {
            this.countUp = new CountUp(this.nFindSingle('title'), this.nFindSingle('title').textContent, options);
            initAnim(this.nRoot, this.startAnim);
        }
    }

    startAnim = () => {
        this.countUp.start();
    };

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
        destroyAnim();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default PinkText;
