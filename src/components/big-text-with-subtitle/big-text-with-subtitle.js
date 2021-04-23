import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import { CountUp } from 'countup.js';
import {initAnim, destroyAnim} from './animations';

class BigTextWithSubtitle extends Component {
    constructor(nRoot) {
        super(nRoot, 'big-text-with-subtitle');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);
        if(this.nRoot.classList.contains(`${this.componentName}_bigger`)) {
            this.countUp = new CountUp(this.nFindSingle('big-text'), this.nFindSingle('big-text').textContent, {
                useGrouping: true,
                suffix: '+',
                separator: ' ',
            });
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

export default BigTextWithSubtitle;
