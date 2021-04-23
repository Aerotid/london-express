import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js';
import LazyLoad from 'vanilla-lazyload/dist/lazyload.min';
import { callbackExit, callbackLoaded } from './helpers';
import Preloader from '../../components/preloader/preloader';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import SandwichMenu from '../../components/sandwich-menu/sandwich-menu';
import FixedContent from '../../components/fixed-content/fixed-content';
import Callbacks from '../../components/callbacks/callbacks';
import PopupFree from '../../components/popup-free/popup-free';
import PopupSubscription from '../../components/popup-subscription/popup-subscription';

const commonComponents = {};
const initCommonComponents = () => {
    commonComponents.lazyLoad = new LazyLoad({
        elements_selector: '.lazy',
        callback_exit: callbackExit,
        callback_loaded: callbackLoaded,
    });
    commonComponents.preloader = new Preloader(document.querySelector('.preloader'));
    commonComponents.header = new Header(document.querySelector('.header'));
    // commonComponents.footer = new Footer(document.querySelector('.footer'));
    commonComponents.sandwichMenu = new SandwichMenu(document.querySelector('.sandwich-menu'));
    commonComponents.callbacks = new Callbacks();
    commonComponents.ctrl = new ScrollMagic.Controller();
    commonComponents.popupFree = new PopupFree(document.querySelector('.popup-free'));
    commonComponents.popupSubscription = new PopupSubscription(document.querySelector('.popup-subscription'));

    // window.addEventListener('load', () => {
    //     commonComponents.fixedContent = new FixedContent(document.querySelector('.fixed-content'));
    // });

    commonComponents.fixedContent = new FixedContent(document.querySelector('.fixed-content'));
};
export {
    initCommonComponents,
    commonComponents,
};
