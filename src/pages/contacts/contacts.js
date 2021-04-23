import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import {getDeviceType, nFindComponent, nFindComponents, nGetBody, vhMobileFix} from '../../common/js/helpers';
import LeadContacts from '../../components/lead-contacts/lead-contacts';
import ContactForm from '../../components/contact-form/contact-form';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import PropBlock from '../../components/prop-block/prop-block';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import {destroyShiftBottomAnim, prepareForShiftBottomAnim} from "../../components/header/animations";
import PopupPr from "../../components/popup-pr/popup-pr";
import PopupCallback from "../../components/popup-callback/popup-callback";
import PopupVacancyQuestionnaire from "../../components/popup-vacancy-questionnaire/popup-vacancy-questionnaire";
import ContactsCard from "../../components/contacts-card/contacts-card";

Barba.BaseView.extend({
    namespace: 'contacts',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();
        if (nFindComponent('lead-contacts')) {
            this.lead = new LeadContacts(nFindComponent('lead-contacts'));
        }

        if (nFindComponent('contact-form')) {
            this.contactForm = new ContactForm(nFindComponent('contact-form'));
        }

        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }

        if (nFindComponent('popup-pr')) {
            this.popupPr = new PopupPr(nFindComponent('popup-pr'));
        }

        if (nFindComponent('popup-callback')) {
            this.popupCallback = new PopupCallback(nFindComponent('popup-callback'));
        }

        if (nFindComponent('popup-vacancy-questionnaire')) {
            this.vacancyQuestionnaire = new PopupVacancyQuestionnaire(nFindComponent('popup-vacancy-questionnaire'));
        }

        if (nFindComponent('contacts-card')) {
            this.cards = nFindComponents('contacts-card').map((card) => new ContactsCard(card));
        }

        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.lead) this.lead.destroy();
        if (this.contactForm) this.contactForm.destroy();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
