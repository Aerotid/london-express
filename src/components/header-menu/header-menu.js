import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';

class HeaderMenu extends Component {
    constructor(nRoot) {
        super(nRoot, 'header-menu');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);
        this.nLinks = this.nFind('link');
    }

    getActiveLink() {
        for (let i = 0; i < this.nLinks.length; i++) {
            if (this.nLinks[i].href === window.location.href ||
                this.nLinks[i].pathname.split('/')[1] === window.location.pathname.split('/')[1] && this.nLinks[i].pathname.split('/')[1] !== '') {
                return this.nLinks[i];
            }
        }
    }

    setActiveLink() {
        const activeLink = this.getActiveLink();
        if (activeLink) activeLink.classList.add('header-menu__link_active');
    }

    resetActiveLink() {
        const activeLink = this.getActiveLink();
        this.nLinks.forEach((link) => {
            if (!link.isEqualNode(activeLink)) link.classList.remove('header-menu__link_active');
        });
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

export default HeaderMenu;
