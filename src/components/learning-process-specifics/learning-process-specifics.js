import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents } from '../../common/js/helpers';
import Btn from '../btn/btn';
import Input from '../input/input';

class LearningProcessSpecifics extends Component {
    constructor(nRoot) {
        super(nRoot, 'learning-process-specifics');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponent('btn', this.nRoot)) {
            this.nBtns = nFindComponents('btn', this.nRoot).map((btn) => new Btn(btn));
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
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default LearningProcessSpecifics;
