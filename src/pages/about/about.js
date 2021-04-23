import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nFindComponents, nGetBody, vhMobileFix } from '../../common/js/helpers';
import Slider from '../../components/slider/slider';
import SliderHistory from '../../components/slider-history/slider-history';
import Lead2 from '../../components/lead-2/lead-2';
import PinkText from '../../components/pink-text/pink-text';
import { prepareForShiftBottomAnim, destroyShiftBottomAnim } from '../../components/header/animations';
import { prepareForSideFormsAppear, destroySideFormsAnim } from '../../components/fixed-content/animations';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';

Barba.BaseView.extend({
    namespace: 'about',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);
        commonComponents.header.nRoot.classList.add('_contrast');
        await commonComponents.preloader.preloading;

        if (nFindComponent('lead-2')) {
            this.lead2 = new Lead2(nFindComponent('lead-2'), 0.2, '#242424', 'about');
        }

        if (nFindComponents('pink-text')) {
            this.pinkText = nFindComponents('pink-text', this.nRoot).map((item) => new PinkText(item));
        }

        if (nFindComponent('slider')) {
            this.slider = new Slider(nFindComponent('slider'));
        }

        if (nFindComponent('slider-history')) {
            this.sliderHistory = new SliderHistory(nFindComponent('slider-history'));
        }

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.pinkText) this.pinkText.forEach((item) => item.destroy());
        if (this.slider) this.slider.destroy();
        commonComponents.header.nRoot.classList.remove('_contrast');
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
        if (this.lead2) this.lead2.destroy();
    },
}).init();
