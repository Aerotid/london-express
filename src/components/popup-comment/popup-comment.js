import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents, emit } from '../../common/js/helpers';
import ContactForm from "../contact-form/contact-form";
import PopupBase from "../popup-base/popup-base";


class PopupComment extends Component {
    constructor(nRoot) {
        super(nRoot, 'popup-comment');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.dataSentHandler = this.dataSentHandler.bind(this);

        this.base = new PopupBase(nFindComponent('popup-base', this.nRoot));

        if (nFindComponent('contact-form', this.nRoot)) {
            this.contactForm = new ContactForm(nFindComponent('contact-form', this.nRoot));
            listen('contact-form:successfully-sent', this.dataSentHandler, this.contactForm.nRoot);
        }

        this.toggleShow = this.toggleShow.bind(this);
        listen('popup-comment:show', this.toggleShow);
    }

    toggleShow() {
        this.base.toggle();
    }

    dataSentHandler(e) {
        this.base.toggle();
        emit('popup-comment:sent', e.detail, false, this.nRoot);
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

export default PopupComment;
