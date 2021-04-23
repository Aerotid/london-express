import getTransition from './transitions';
import Barba from '../../../node_modules/barba.js/dist/barba.min';
import {
    isFunction,
    isDirectEnter,
    nGetBody,
    isIE,
    addLoopLinksPreventer,
    removeLoopLinksPreventer,
} from './helpers';
import initInnerPage from './inner';
import './views';
import { commonComponents, initCommonComponents } from './commonComponents';
// import CookieMessage from '../../components/cookie-message/cookie-message';
// import { destroyShiftBottomAnim } from '../../components/header/animations';

const GeneralTransition = Barba.BaseTransition.extend({
    start() {
        this.newContainerLoading.then(() => {
            const [sourceNamespace, targetNamespace] = [...document.querySelectorAll('[data-namespace]')].map(node => node.getAttribute('data-namespace'));
            const transition = getTransition(sourceNamespace, targetNamespace);
            if (isFunction(transition)) {
                transition(this);
            } else {
                this.done();
            }
        });
    },
});
Barba.Dispatcher.on('newPageReady', (currentStatus) => {
    removeLoopLinksPreventer();
    addLoopLinksPreventer();
    objectFitPolyfill();
    const currentBrowser = isIE();
    if (currentBrowser.name === 'Internet Explorer') {
        nGetBody().classList.add('ie');
        nGetBody().classList.add(`ie-${currentBrowser.version}`);
    }
    if (isDirectEnter()) {
        nGetBody().style.height = `${window.innerHeight}px`;
        initCommonComponents();
    }
    // destroyShiftBottomAnim();
    if (currentStatus.namespace !== 'index') {
        initInnerPage();
    }
});

Barba.Dispatcher.on('transitionCompleted', async (currentStatus) => {
    const dataUrl = document.querySelector('.barba-container').getAttribute('data-translation-url');
    commonComponents.header.languageSelector.updateLink(dataUrl);
    commonComponents.sandwichMenu.languageSelector.updateLink(dataUrl);

    window.scrollTo(0, 0);
    if (currentStatus.namespace === 'index') {
        nGetBody().classList.remove('page-inner');
    }
});

Barba.Pjax.getTransition = () => GeneralTransition;
Barba.Prefetch.init();
Barba.Pjax.start({ ignoreFiles: ['pdf', 'doc', 'exe', 'dmg'] });

export default commonComponents;
