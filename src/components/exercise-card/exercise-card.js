import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize } from '../../common/js/helpers';
import LazyLinePainter from '../../../node_modules/lazy-line-painter/lib/lazy-line-painter-1.9.6.min';
import 'svg-classlist-polyfill';

class ExerciseCard extends Component {
    constructor(nRoot) {
        super(nRoot, 'exercise-card');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);
        this.svg = this.nFind('svg svg');
        this.count = 0;

        this.nRoot.addEventListener('mouseenter', this.init, false);
        this.nRoot.addEventListener('mouseleave', this.remove, false);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);
    }

    init = () => {
        this.myAnimation = new LazyLinePainter(this.svg[this.count], {"reverse": true, "ease":"easeLinear","strokeWidth":2,"strokeOpacity":.4,"strokeColor":"#242424","strokeCap":"square"});
        this.myAnimation.paint();
        if (this.svg.length > 1) {
            this.timerId = setInterval(() => {
                if (this.count === 0) this.svg[this.count].classList.remove('lazy-line-painter');
                this.svg[this.count].classList.remove('show');
                if (this.count < this.svg.length - 1) {
                    this.count = this.count + 1;
                } else {
                    this.count = 0;
                }
                this.svg[this.count].classList.add('show');
                // this.myAnimation = new LazyLinePainter(this.svg[this.count], {"reverse": true, "ease":"easeLinear","strokeWidth":2,"strokeOpacity":.4,"strokeColor":"#242424","strokeCap":"square"});
                // this.myAnimation.paint();
            }, 3000);
        }
    };

    remove = () => {
        this.svg[this.count].classList.remove('lazy-line-painter');
        this.svg[this.count].classList.remove('show');
        this.count = 0;
        clearInterval(this.timerId);
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

export default ExerciseCard;
