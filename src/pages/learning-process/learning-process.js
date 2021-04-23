import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nGetBody, vhMobileFix } from '../../common/js/helpers';
import Lead2 from '../../components/lead-2/lead-2';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import LessonsGiftBanner from '../../components/lessons-gift-banner/lessons-gift-banner';
import LearningProcessSpecifics from '../../components/learning-process-specifics/learning-process-specifics';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';
import PropBlock from '../../components/prop-block/prop-block';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'learning-process',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (nFindComponent('lead-2')) {
            this.lead2 = new Lead2(nFindComponent('lead-2'), 1, '#FFFFFF', 'bottom-up');
        }

        if (nFindComponent('lessons-gift-banner')) {
            this.lessons = new LessonsGiftBanner(nFindComponent('lessons-gift-banner'));
        }

        if (nFindComponent('learning-process-specifics')) {
            this.lessons = new LearningProcessSpecifics(nFindComponent('learning-process-specifics'));
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
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        if (this.lead2) this.lead2.destroy();
        destroyShiftBottomAnim();
    },
}).init();
