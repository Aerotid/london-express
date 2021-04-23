import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

class PopupBase extends Component {
    constructor(nRoot, dataTrigger) {
        super(nRoot, 'popup-base');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        this.dataTrigger = dataTrigger;
        this.findTriggers();

        this.nContainer = this.nFindSingle('container');

        this.nBtnClose = this.nFindSingle('close');
        this.nBtnClose.addEventListener('click', this.toggle);
        document.addEventListener('keydown', this.escClose);

        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    findTriggers = () => {
        this.triggers = document.querySelectorAll(`[data=${this.dataTrigger}]`);
        [...this.triggers].forEach(trigger => {
            trigger.addEventListener('click', this.toggle);
        });
    };

    removeTriggers = () => {
        [...this.triggers].forEach(trigger => {
            trigger.removeEventListener('click', this.toggle);
        });
    };

    isOpened = () => {
        return this.nRoot.classList.contains('popup-base_show');
    };

    toggle = (e) => {
        if (e) {
            e.preventDefault();
        }
        if (this.nRoot.classList.contains('popup-base_show')) {
            this.nRoot.classList.remove('popup-base_show');
            enableBodyScroll(this.nRoot);

            if (this.nContainer.offsetHeight < window.innerHeight) {
                TweenLite.to(this.nContainer, 0.3, { yPercent: -40 });
            } else {
                TweenLite.to(this.nContainer, 0.3, { top: '10%' });
            }
        } else {
            this.nRoot.classList.add('popup-base_show');
            disableBodyScroll(this.nRoot);

            if (this.nContainer.offsetHeight < window.innerHeight) {
                TweenLite.set(this.nRoot, { clearProps: 'overflowY' });
                TweenLite.set(this.nContainer, { top: '50%', yPercent: -40 });
                TweenLite.to(this.nContainer, 0.3, { yPercent: -50 });
            } else {
                TweenLite.set(this.nRoot, { overflowY: 'scroll' });
                TweenLite.set(this.nContainer, { top: '10%', yPercent: 0 });
                TweenLite.to(this.nContainer, 0.3, { top: 0 });
            }
        }

        // if (nGetBody().classList.contains('sandwich-open')) {
        //     nGetBody().classList.remove('sandwich-open');
        // } else {
        //     nGetBody().classList.add('sandwich-open');
        // }
    };

    escClose = (e) => {
        if (this.isOpened() && e.keyCode === 27) {
            this.toggle();
        }
    };

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

        if (this.nRoot.classList.contains('popup-base_show')) {
            if (this.nContainer.offsetHeight < window.innerHeight) {
                TweenLite.set(this.nRoot, { clearProps: 'overflowY' });
                TweenLite.to(this.nContainer, 0.3, { top: '50%', yPercent: -50 });
            } else {
                TweenLite.set(this.nRoot, { overflowY: 'scroll' });
                TweenLite.to(this.nContainer, 0.3, { top: 0, yPercent: 0 });
            }
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

export default PopupBase;
