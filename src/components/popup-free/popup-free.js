import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nGetBody } from '../../common/js/helpers';
import ContactForm from '../../components/contact-form/contact-form';
import PopupBase from '../popup-base/popup-base';

class PopupFree extends Component {
    constructor(nRoot) {
        super(nRoot, 'popup-free');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.base = new PopupBase(nFindComponent('popup-base', this.nRoot), 'free-popup');

        if (nFindComponent('contact-form', this.nRoot)) {
            this.contactModal = new ContactForm(nFindComponent('contact-form', this.nRoot), true);
            this.sentHandler = this.sentHandler.bind(this);
            listen('contact-form:successfully-sent', this.sentHandler, this.contactModal.nRoot);
        }
    }

    sentHandler() {
        this.base.toggle();
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

export default PopupFree;
