import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { prepareForShiftBottomAnim, destroyShiftBottomAnim } from '../../components/header/animations';
import { prepareForSideFormsAppear, destroySideFormsAnim } from '../../components/fixed-content/animations';
import SliderLead from '../../components/slider-lead/slider-lead';
import ExerciseCard from '../../components/exercise-card/exercise-card';
import RegisterProposal from '../../components/register-proposal/register-proposal';
import {
    nFindComponent, nGetBody, nFindComponents, getDeviceType, delay,
} from '../../common/js/helpers';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';
import PropBlock from '../../components/prop-block/prop-block';

Barba.BaseView.extend({
    namespace: 'index',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() !== 'mobile') prepareForAnimContent(this.container);

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        this.nSliderLead = new SliderLead(nFindComponent('slider-lead'));

        if (nFindComponents('exercise-card')) {
            this.nExerciseCards = nFindComponents('exercise-card').map((item) => new ExerciseCard(item));
        }

        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }

        if (getDeviceType() !== 'mobile') initAppearAnimContent(this.container);
        if (nFindComponent('register-proposal')) {
            this.registerProposal = new RegisterProposal(nFindComponent('register-proposal'));
        }
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() !== 'mobile') destroyAppearAnimContent();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
        if (this.nSliderLead) this.nSliderLead.destroy();
        if (this.registerProposal) this.registerProposal.destroy();
    },
})
    .init();
