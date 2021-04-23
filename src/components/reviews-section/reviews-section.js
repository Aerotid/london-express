import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, nFindComponents, Resize } from '../../common/js/helpers';
import Review from '../../components/review/review';
import EndlessBtn from '../../components/endless-btn/endless-btn';
import { commonComponents } from '../../common/js/commonComponents';

class ReviewsSection extends Component {
    constructor(nRoot) {
        super(nRoot, 'reviews-section');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponents('review', this.nRoot)) {
            this.nReviews = nFindComponents('review', this.nRoot).map((review) => new Review(review));
        }

        this.newReviewsHandler = this.newReviewsHandler.bind(this);
        if (nFindComponent('endless-btn', this.nRoot)) {
            this.endlessBtn = new EndlessBtn(nFindComponent('endless-btn', this.nRoot), null, this.nFindSingle('list'));
            listen('endless-btn:nodes-added', this.newReviewsHandler, this.endlessBtn.nRoot);
        }
    }

    newReviewsHandler(e) {
        commonComponents.lazyLoad.update();
        e.detail.newNodsArr.forEach((newNod) => {
            this.nReviews.push(new Review(newNod));
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

        if (this.nReviews) this.nReviews.forEach(item => item.destroy());
        if (this.endLessBtn) this.endLessBtn.destroy();
    }
}

export default ReviewsSection;
