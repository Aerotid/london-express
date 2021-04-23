import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import BtnExpand from '../btn-expand/btn-expand';
import 'bootstrap.native/dist/polyfill';
import Collapse from 'bootstrap.native/dist/components/collapse-native';

class Question extends Component {
    constructor(nRoot) {
        super(nRoot, 'question');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.bsCollapse = new Collapse(this.nFindSingle('expand-button'));

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponent('btn-expand', this.nRoot)) {
            this.expandButton = new BtnExpand(nFindComponent('btn-expand', this.nRoot));
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

export default Question;
