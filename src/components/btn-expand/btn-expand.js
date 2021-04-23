import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize } from '../../common/js/helpers';

class BtnExpand extends Component {
    constructor(nRoot) {
        super(nRoot, 'btn-expand');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.nCollapse = this.nFindSingle('collapse');
        this.nExpand = this.nFindSingle('expand');
        this.toggleExpand = this.toggleExpand.bind(this);
    }

    hide() {
        this.nRoot.classList.add('btn-expand_hidden');
    }

    toggleExpand() {
        this.nRoot.classList.toggle('collapsed');
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

export default BtnExpand;
