import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nGetBody } from '../../common/js/helpers';
import ReviewsSection from '../../components/reviews-section/reviews-section';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import SliderAchievements from "../../components/slider-achievements/slider-achievements";
import ExamResultsCircle from "../../components/exam-results-circle/exam-results-circle";

Barba.BaseView.extend({
    namespace: 'reviews',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        if (nFindComponent('slider-achievements')) {
            this.achievements = new SliderAchievements(nFindComponent('slider-achievements'));
        }

        if (nFindComponent('exam-results-circle')) {
            this.results = new ExamResultsCircle(nFindComponent('exam-results-circle'));
        }

        if (nFindComponent('reviews-section')) {
            this.reviewsSection = new ReviewsSection(nFindComponent('reviews-section'));
        }

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        commonComponents.header.nRoot.classList.add('_contrast');
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.achievements) this.achievements.destroy();
        if (this.results) this.results.destroy();
        if (this.reviewsSection) this.reviewsSection.destroy();
        destroySideFormsAnim();
        commonComponents.header.nRoot.classList.remove('_contrast');
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
