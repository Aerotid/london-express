import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize } from '../../common/js/helpers';
import { destroyRegisterProposalAnim, registerProposalAnim } from './animations';

class RegisterProposal extends Component {
    constructor(nRoot) {
        super(nRoot, 'register-proposal');
        this.noteBook = this.nFindSingle('img');
        this.circleLeft = this.nFindSingle('circle-left');
        this.circleRight = this.nFindSingle('circle-right');
        this.overlay = this.nFindSingle('img');
        this.lastWork = this.nFindSingle('last-work');
        this.notice = this.nFindSingle('notice');
        this.upcomingLesson = this.nFindSingle('upcoming-lesson');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    initDesktop() {
        registerProposalAnim(this);
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
        destroyRegisterProposalAnim();
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

export default RegisterProposal;
