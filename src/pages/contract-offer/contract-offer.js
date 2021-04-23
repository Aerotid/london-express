import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nGetBody } from '../../common/js/helpers';
import { initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import { destroySideFormsAnim, prepareForSideFormsAppear } from '../../components/fixed-content/animations';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';

Barba.BaseView.extend({
    namespace: 'contract-offer',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);
        commonComponents.header.nRoot.classList.add('_contrast');
        await commonComponents.preloader.preloading;
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        objectFitPolyfill();
    },
    onLeave() {
        destroySideFormsAnim();
        commonComponents.header.nRoot.classList.remove('_contrast');
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
