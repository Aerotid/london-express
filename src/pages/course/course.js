import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import {getDeviceType, nFindComponent, nGetBody} from "../../common/js/helpers";
import {
    destroyAppearAnimContent,
    initAppearAnimContent,
    prepareForAnimContent
} from "../../common/js/contentAnimations";
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import {destroyShiftBottomAnim, prepareForShiftBottomAnim} from "../../components/header/animations";
import PropBlock from "../../components/prop-block/prop-block";
import SliderLevels from "../../components/slider-levels/slider-levels";
import CourseModules from '../../components/course-modules/course-modules';

Barba.BaseView.extend({
    namespace: 'course',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        commonComponents.header.nRoot.classList.add('_contrast');

        await commonComponents.preloader.preloading;

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }

        if (nFindComponent('slider-levels')) {
            this.levels = new SliderLevels(nFindComponent('slider-levels'));
        }

        if (nFindComponent('course-modules')) {
            this.modules = new CourseModules(nFindComponent('course-modules'));
        }

        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        destroySideFormsAnim();
        commonComponents.header.nRoot.classList.remove('_contrast');
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
