import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nFindComponents, nGetBody, vhMobileFix } from '../../common/js/helpers';
import {destroyShiftBottomAnim, prepareForShiftBottomAnim} from "../../components/header/animations";
import Lead2 from "../../components/lead-2/lead-2";
import TeachersList from '../../components/teachers-list/teachers-list';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';
import BigTextWithSubtitle from '../../components/big-text-with-subtitle/big-text-with-subtitle';
import PropBlock from '../../components/prop-block/prop-block';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'teachers',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (nFindComponent('lead-2')) {
            this.lead2 = new Lead2(nFindComponent('lead-2'), 1, '#FFFFFF', 'teachers');
        }

        if (nFindComponents('big-text-with-subtitle')) {
            this.bigTextWithSubtitle = nFindComponents('big-text-with-subtitle', this.nRoot).map((item) => new BigTextWithSubtitle(item));
        }

        if (nFindComponent('teachers-list')) {
            this.teachers = new TeachersList(nFindComponent('teachers-list'));
        }

        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
    },
    onLeave() {
        if (this.bigTextWithSubtitle) this.bigTextWithSubtitle.forEach((item) => item.destroy());
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.teachers) this.teachers.destroy();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        if (this.lead2) this.lead2.destroy();
        destroyShiftBottomAnim();
    },
}).init();
