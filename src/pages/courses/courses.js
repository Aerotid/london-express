import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nFindComponents, nGetBody, vhMobileFix } from '../../common/js/helpers';
import Lead2 from "../../components/lead-2/lead-2";
import CourseCard2 from "../../components/course-card-2/course-card-2";
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';
import PropBlock from '../../components/prop-block/prop-block';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import SubscriptionFreeCourse from "../../components/subscription-free-course/subscription-free-course";

Barba.BaseView.extend({
    namespace: 'courses',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (nFindComponent('lead-2')) {
            this.lead2 = new Lead2(nFindComponent('lead-2'), 1, '#FFFFFF');
        }

        if (nFindComponent('subscription-free-course')) {
            this.subscribeForm = new SubscriptionFreeCourse(nFindComponent('subscription-free-course'));
        }

        if (nFindComponent('course-card-2')) {
            this.courseCard2 = nFindComponents('course-card-2').map(card => new CourseCard2(card));
        }

        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);

        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.subscribeForm) this.subscribeForm.destroy();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
        if (this.lead2) this.lead2.destroy();
    },
}).init();
