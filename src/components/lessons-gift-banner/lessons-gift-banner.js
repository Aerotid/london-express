import Component from '../../common/js/component';
import {getDeviceType, listen, unlisten, nFindComponent, Resize, isIE} from '../../common/js/helpers';
import Btn from '../btn/btn';

class LessonsGiftBanner extends Component {
    constructor(nRoot) {
        super(nRoot, 'lessons-gift-banner');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        if (nFindComponent('btn', this.nRoot)) {
            this.btn = new Btn(nFindComponent('btn', this.nRoot));
        }

        this.nImg = this.nFindSingle('bg img');
        this.nPicture = this.nRoot.querySelector('picture');

        if (isIE()) {
            if (getDeviceType() === 'tablet' || getDeviceType() === 'mobile') {
                this.nImg.setAttribute('data-object-fit', 'contain');
            }
        }
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        const newDevice = getDeviceType();
        if (newDevice !== this.currentDevice) {
            if (getDeviceType() === 'mobile') {
                this.destroyDesktop();
                this.initMobile();
            } else if (this.currentDevice === 'mobile') {
                this.destroyMobile();
                this.initDesktop();
            }

            if (newDevice === 'desktop') {
                this.nImg.setAttribute('data-object-fit', 'cover');
            } else if (newDevice === 'mobile' || newDevice === 'tablet') {
                this.nImg.setAttribute('data-object-fit', 'contain');
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

export default LessonsGiftBanner;
