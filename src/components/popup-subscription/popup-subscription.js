import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import PopupBase from '../popup-base/popup-base';
import Subscription from '../subscription/subscription';

class PopupSubscription extends Component {
    constructor(nRoot) {
        super(nRoot, 'popup-subscription');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.base = new PopupBase(nFindComponent('popup-base', this.nRoot), 'subscription-popup');

        if (nFindComponent('subscription', this.nRoot)) {
            this.form = new Subscription(nFindComponent('subscription', this.nRoot));
            this.sentHandler = this.sentHandler.bind(this);
            listen('subscription:successfully-sent', this.sentHandler, this.form.nRoot);
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

export default PopupSubscription;
