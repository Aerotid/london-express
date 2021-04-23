import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nFindComponents, nGetBody, vhMobileFix } from '../../common/js/helpers';
import VideoBlock from '../../components/video-block/video-block';
import Slider from '../../components/slider/slider';
import ContactForm from '../../components/contact-form/contact-form';
import Lead2 from '../../components/lead-2/lead-2';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';
import PopupVacancyQuestionnaire from '../../components/popup-vacancy-questionnaire/popup-vacancy-questionnaire';
import Btn from '../../components/btn/btn';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'vacancies',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();
        commonComponents.header.nRoot.classList.add('_contrast');

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (nFindComponent('lead-2')) {
            this.lead2 = new Lead2(nFindComponent('lead-2'), 0.3, '#242424', 'bottom-up');
        }

        if (nFindComponent('video-block')) {
            this.videoBlock = new VideoBlock(nFindComponent('video-block'));
        }

        if (nFindComponent('slider')) {
            this.slider = new Slider(nFindComponent('slider'));
        }

        if (nFindComponent('contact-form')) {
            this.contactModal = new ContactForm(nFindComponent('contact-form'));
        }

        if (nFindComponent('popup-vacancy-questionnaire')) {
            this.vacancyQuestionnaire = new PopupVacancyQuestionnaire(nFindComponent('popup-vacancy-questionnaire'), true);
        }

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        destroySideFormsAnim();
        commonComponents.header.nRoot.classList.remove('_contrast');
    },
    onLeaveCompleted() {
        if (this.lead2) this.lead2.destroy();
        destroyShiftBottomAnim();
    },
}).init();
