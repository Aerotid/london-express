import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize,
} from '../../common/js/helpers';
import BtnExpand from '../btn-expand/btn-expand';
import PostStats from "../post-stats/post-stats";
import debounce from 'lodash.debounce';

class Review extends Component {
    constructor(nRoot) {
        super(nRoot, 'review');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.expandToggle = debounce(this.expandToggle.bind(this), 300);
        this.calculateMaxHeight = this.calculateMaxHeight.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        if (nFindComponent('btn-expand', this.nRoot)) {
            this.expandButton = new BtnExpand(nFindComponent('btn-expand', this.nRoot));
        }

        if (nFindComponent('post-stats', this.nRoot)) {
            this.postStats = new PostStats(nFindComponent('post-stats', this.nRoot));
        }

        this.nText = this.nFindSingle('text');
        this.nPreview = this.nFindSingle('text-preview');
        this.nDetail = this.nFindSingle('text-detail');
        this.textPar = this.nText.querySelectorAll('p');

        this.expandButton.nRoot.addEventListener('click', this.expandToggle);

        if (!this.nDetail || this.nDetail.innerHTML === '') {
            this.expandButton.hide();
        } else {
            this.nText.style.maxHeight = `${this.nPreview.scrollHeight}px`;
        }
    }

    expandToggle() {
        this.expandButton.toggleExpand();
        this.nText.classList.toggle('is-expanded');
        this.calculateMaxHeight();
    }

    calculateMaxHeight() {
        if (this.nText.classList.contains('is-expanded')) {
            this.nText.style.maxHeight = `${this.nText.scrollHeight}px`;
        } else {
            this.nText.style.maxHeight = `${this.nPreview.scrollHeight}px`;
        }
    }

    initDesktop() {
    }

    initMobile() {
    }

    afterResize() {
        this.calculateMaxHeight();
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

export default Review;
