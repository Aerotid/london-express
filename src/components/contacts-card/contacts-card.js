import Component from '../../common/js/component';
import {getDeviceType, listen, unlisten, nFindComponent, Resize, emit} from '../../common/js/helpers';

class ContactsCard extends Component {
    constructor(nRoot) {
        super(nRoot, 'contacts-card');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.nBtn = this.nFindSingle('btn');

        if (this.nBtn.getAttribute('data') === 'questionnaire-popup') {
            this.nBtn.addEventListener('click', () => {
                emit('popupQuestionnaire:show');
            });
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

export default ContactsCard;
