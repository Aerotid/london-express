import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize } from '../../common/js/helpers';

class Notification extends Component {
    constructor(nRoot) {
        super(nRoot, 'notification');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        this.hide = this.hide.bind(this);
        //this.closeBtn = this.nFindSingle('btn-close');
        //this.closeBtn.addEventListener('click', this.hide);
    }

    show() {
        this.nRoot.classList.add('show');

        setTimeout(() => {
            this.hide();
        }, 2000);
    }

    hide() {
        this.nRoot.classList.remove('show');
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        //this.closeBtn.removeEventListener('click', this.hide);
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'desktop') {
                this.destroyMobile();
                this.initDesktop();
            } else if (this.currentDevice === 'desktop') {
                this.destroyDesktop();
                this.initMobile();
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

export default Notification;
