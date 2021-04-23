import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';

class CourseCard2 extends Component {
    constructor(nRoot) {
        super(nRoot, 'course-card-2');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.btn = this.nRoot.querySelector('button.btn');
        this.afterResize = this.afterResize.bind(this);
        this.addHover = this.addHover.bind(this);
        this.removeHover = this.removeHover.bind(this);
        this.nRoot.addEventListener('mouseover', this.addHover);
        this.nRoot.addEventListener('mouseout', this.removeHover);
    }

    addHover() {
        this.btn.classList.add('btn_white-border');
    }

    removeHover() {
        this.btn.classList.remove('btn_white-border');
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

export default CourseCard2;
