import Component from '../../common/js/component';
import {getDeviceType, listen, unlisten, nFindComponent, Resize} from '../../common/js/helpers';

class ContactButton extends Component {
    constructor(nRoot) {
        super(nRoot, 'contact-button');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        this.nTitle = this.nFindSingle('title');
        this.oldTitle = this.nTitle.innerHTML;
    }

    updateState(type) {
        if (type) {
            this.nRoot.classList.remove('wait');
            this.nRoot.classList.add('success');
            //this.nTitle.innerHTML = successText;
        } else {
            this.nRoot.classList.remove('wait');
            this.nRoot.classList.add('error');
            //this.nTitle.innerHTML = errorText;
        }
    }

    waiting() {
        this.nRoot.classList.add('wait');
    }

    enabled(state = false) {
        if (state) {
            this.nRoot.classList.remove('disabled');
            this.nRoot.removeAttribute('disabled');
        } else {
            if (this.nRoot.classList.contains('error') || this.nRoot.classList.contains('success')) {
                this.returnOldTitle();
            }

            this.nRoot.classList.add('disabled');
            this.nRoot.setAttribute('disabled', '');
        }
    }

    returnOldTitle() {
        this.nRoot.classList.remove('success');
        this.nRoot.classList.remove('error');
        this.nTitle.innerHTML = this.oldTitle;
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
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

export default ContactButton;
