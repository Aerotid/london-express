import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';

class SiteAwards extends Component {
    constructor(nRoot) {
        super(nRoot, 'site-awards');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.nAwards = this.nFind('award');
        this.showAll = this.showAll.bind(this);
        this.hideAll = this.hideAll.bind(this);
        this.nAllAwards = this.nFindSingle('all');

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.nRoot.classList.add('site-awards_visible');
    }


    showAll() {
        this.nRoot.classList.add('_show-all');
    }

    hideAll() {
        this.nRoot.classList.remove('_show-all');
    }

    setActive(index) {
        let hideTween, appearTween;
        this.nAwards.forEach((award, i) => {
            if (award.classList.contains('site-awards__award_active')) {
                award.classList.remove('site-awards__award_active');
                hideTween = new TimelineLite().to(award, 0.3, { opacity: 0, visibility: 'hidden' }).set(award, { height: 0 });
            }
            if (i === index) {
                award.classList.add('site-awards__award_active');
                appearTween = new TimelineLite().set(award, { height: 'auto' }).to(award, 0.3, { opacity: 1, visibility: 'visible' });
            }
        });
        hideTween ? new TimelineLite().add(hideTween).add(appearTween) : new TimelineLite().add(appearTween);
    }

    initDesktop() {
        this.nRoot.addEventListener('mouseenter', this.showAll);
        this.nAllAwards.addEventListener('mouseleave', this.hideAll);
        this.nAllAwards.addEventListener('touchend', this.hideAll);
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
        this.nRoot.removeEventListener('mouseenter', this.showAll);
        this.nAllAwards.removeEventListener('mouseleave', this.hideAll);
        this.nAllAwards.removeEventListener('touchend', this.hideAll);
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

export default SiteAwards;
