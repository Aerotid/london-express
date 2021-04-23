import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js';
import { commonComponents } from '../../common/js/commonComponents';
import { emit, getDeviceType, isDirectEnter, nGetBody, offset } from '../../common/js/helpers';
import 'debug.addIndicators';

let scene = null;
let showAnimation = null;
let hideAnimation = null;

const scrollSideForms = (nContainer, topOffset, reverse) => {
    const sectionBox = offset(nContainer);
    const chatraSize = getDeviceType() === 'mobile' ? 70 : 100;
    Chatra('setButtonSize', chatraSize);

    topOffset = topOffset || 1 * (sectionBox.bottom - sectionBox.top);

    TweenMax.set(commonComponents.fixedContent.nRoot, { opacity: 0, visibility: 'hidden' });
    TweenMax.set(commonComponents.fixedContent.chat, { opacity: 0, display: 'none' });

    scene = new ScrollMagic.Scene({
        triggerElement: nContainer,
        triggerHook: reverse ? 'onEnter' : 0,
        offset: topOffset,
    })
        .on(reverse ? 'leave' : 'enter', () => {
            if (hideAnimation) {
                hideAnimation.kill();
            }

            Chatra('show');

            showAnimation = TweenMax.fromTo(
                commonComponents.fixedContent.nRoot,
                0.5,
                { opacity: 0, visibility: 'hidden' },
                {
                    opacity: 1,
                    visibility: 'visible',
                    onComplete: () => showAnimation = null,
                },
            );
        })
        .on(reverse ? 'enter' : 'leave', () => {
            if (nGetBody().classList.contains('chatra-mobile-widget-expanded')) {
                return;
            }

            if (showAnimation) {
                showAnimation.kill();
            }

            Chatra('hide');

            hideAnimation = TweenMax.to(
                commonComponents.fixedContent.nRoot,
                0.5,
                {
                    opacity: 0,
                    visibility: 'hidden',
                    onComplete: () => {
                        hideAnimation = null;
                    },
                },
            );

        })
        .addTo(commonComponents.ctrl);
};

export const prepareForSideFormsAppear = (nContainer, topOffset, reverse) => {
    const scrollHandler = () => {
        window.removeEventListener('scroll', scrollHandler);
        scrollSideForms(nContainer, topOffset, reverse);
    };
    window.addEventListener('scroll', scrollHandler);
};

export const destroySideFormsAnim = (section) => {
    if (commonComponents.fixedContent && commonComponents.fixedContent.subscriptionForm) {
        commonComponents.fixedContent.subscriptionForm.nRoot.classList.add('collapsed');
        TweenMax.set(commonComponents.fixedContent.nRoot, { clearProps: 'opacity,visibility' });
    }

    try {
        Chatra('hide')
    } catch (e) {};

    if (hideAnimation) {
        hideAnimation.kill();
    }
    if (hideAnimation) {
        hideAnimation.kill();
    }
    if (showAnimation) {
        showAnimation.kill();
    }
    if (scene) {
        scene.destroy();
    }
};
