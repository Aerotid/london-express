import Component from '../../common/js/component';
import {getDeviceType, listen, unlisten, nFindComponent, Resize, nGetBody, emit, delay} from '../../common/js/helpers';
import {commonComponents} from "../../common/js/commonComponents";

class SandwichMenuBtn extends Component {
    constructor(nRoot) {
        super(nRoot, 'sandwich-menu-btn');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.isOpened = false;
        this.clickHandler = this.clickHandler.bind(this);
        this.nRoot.addEventListener('click', this.clickHandler);

        this.open = this.open.bind(this);
        listen('sandwichMenu:open', this.open);
        this.close = this.close.bind(this);
        listen('sandwichMenu:close', this.close);
    }

    clickHandler() {
        if (this.isOpened && commonComponents.sandwichMenu.isAnimationComplete) {
            emit('sandwichMenu:close');
        } else if (commonComponents.sandwichMenu.isAnimationComplete) {
            emit('sandwichMenu:open');
        }
    }

    open() {
        this.isOpened = true;
        document.body.classList.add('sandwich-open');
    }

    close() {
        this.isOpened = false;
        document.body.classList.remove('sandwich-open')
        document.body.classList.add('sandwich-closing-contrast')
        delay(600).then(() => document.body.classList.remove('sandwich-closing-contrast'));
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

export default SandwichMenuBtn;
