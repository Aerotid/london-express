import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import PinkText from '../../components/pink-text/pink-text';
import Partners from '../../components/partners/partners';
import PriceSlider from '../../components/price-slider/price-slider';
import GreatOffers from '../../components/great-offers/great-offers';
import QuestionsList from '../../components/questions-list/questions-list';
import { getDeviceType, nFindComponent, nFindComponents, nGetBody } from '../../common/js/helpers';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import PropBlock from '../../components/prop-block/prop-block';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'price',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        if (nFindComponent('partners')) {
            this.partners = new Partners(nFindComponent('partners'));
        }
        if (nFindComponent('great-offers')) {
            this.greatOffers = new GreatOffers(nFindComponent('great-offers'));
        }
        commonComponents.header.nRoot.classList.add('_contrast');
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        if (nFindComponents('pink-text')) {
            this.pinkText = nFindComponents('pink-text', this.nRoot).map((item) => new PinkText(item, false));
        }
        if (nFindComponents('price-slider')) {
            this.priceSlider = nFindComponents('price-slider', this.nRoot).map((item) => new PriceSlider(item));
        }
        if (nFindComponent('questions-list')) {
            this.questionsList = new QuestionsList(nFindComponent('questions-list'));
        }
        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }
        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.pinkText) this.pinkText.forEach((item) => item.destroy());
        if (this.partners) this.partners.destroy();
        if (this.greatOffers) this.greatOffers.destroy();
        if (this.questionsList) this.questionsList.destroy();
        commonComponents.header.nRoot.classList.remove('_contrast');
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
