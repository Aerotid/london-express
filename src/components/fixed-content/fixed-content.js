import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import SubscriptionFormSide from '../subscription-form-side/subscription-form-side';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Chat from "../chat/chat";

class FixedContent extends Component {
    constructor(nRoot) {

        super(nRoot, 'fixed-content');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.subscriptionFormExpanded = this.subscriptionFormExpanded.bind(this);
        this.subscriptionFormCollapsed = this.subscriptionFormCollapsed.bind(this);

        if (nFindComponent('subscription-form-side', this.nRoot)) {
            this.subscriptionForm = new SubscriptionFormSide(nFindComponent('subscription-form-side', this.nRoot));
        }

        if (nFindComponent('chat', this.nRoot)) {
            this.chat = new Chat(nFindComponent('chat', this.nRoot));
        }

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    subscriptionFormExpanded() {
        disableBodyScroll(this.nRoot);
        this.nRoot.classList.add('fixed-content_fullscreen');
    }

    subscriptionFormCollapsed() {
        enableBodyScroll(this.nRoot);
        this.nRoot.classList.remove('fixed-content_fullscreen');
    }

    initDesktop() {
    }

    initMobile() {
        if (this.subscriptionForm) {
            listen('subscription-form-side:expanded', this.subscriptionFormExpanded, this.subscriptionForm.nRoot);
            listen('subscription-form-side:collapsed', this.subscriptionFormCollapsed, this.subscriptionForm.nRoot);
        }
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
        if (this.subscriptionForm) {
            unlisten('subscription-form-side:expanded', this.subscriptionFormExpanded, this.subscriptionForm.nRoot);
            unlisten('subscription-form-side:collapsed', this.subscriptionFormCollapsed, this.subscriptionForm.nRoot);
        }
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

export default FixedContent;
