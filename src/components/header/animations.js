import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js';
import { commonComponents } from '../../common/js/commonComponents';
import {emit, nGetBody, offset} from '../../common/js/helpers';
import 'debug.addIndicators';

let scene = null;
let showAnimation = null;
let hideAnimation = null;

const headerWasContrast = false;

export const prepareForShiftBottomAnim = (nContainer, topOffset, singleHeader = false) => {
    if (!singleHeader) {
        commonComponents.header.nRoot.style.position = 'fixed';
        TweenMax.set(commonComponents.header.nRoot, { yPercent: -100 });
    }
    const sectionBox = offset(nContainer);

    topOffset = topOffset || 1 * (sectionBox.bottom - sectionBox.top);

    scene = new ScrollMagic.Scene({
        triggerElement: nContainer,
        triggerHook: 0,
        offset: topOffset,
    })
        .on('enter', () => {
            if (!nGetBody().classList.contains('sandwich-open')) {
                emit('header:header-show');
                commonComponents.header.nRoot.style.position = 'fixed';
                if (hideAnimation) {
                    hideAnimation.kill();
                }
                commonComponents.header.nRoot.classList.add('header_sticky');

                // commonComponents.header.switchToContrast();

                showAnimation = TweenMax.fromTo(
                    commonComponents.header.nRoot,
                    0.5,
                    { yPercent: -100 },
                    {
                        yPercent: 0,
                        clearProps: 'yPercent',
                        onComplete: () => showAnimation = null,
                    },
                );
            }
        })
        .on('leave', () => {
            if (!nGetBody().classList.contains('sandwich-open')) {
                emit('header:header-hide');
                if (showAnimation) {
                    showAnimation.kill();
                }
                hideAnimation = TweenMax.to(
                    commonComponents.header.nRoot,
                    0.15,
                    {
                        yPercent: -100,
                        onComplete: () => {
                            hideAnimation = null;
                            if (singleHeader) {
                                commonComponents.header.nRoot.style.removeProperty('transform');
                                commonComponents.header.nRoot.style.removeProperty('position');
                                commonComponents.header.nRoot.classList.remove('header_sticky');

                                // commonComponents.header.switchToNonContrast();
                            }
                        },
                    },
                );
            }
        })
        .addTo(commonComponents.ctrl);
};

export const destroyShiftBottomAnim = (section, contrastHeader = true) => {
    commonComponents.header.nRoot.classList.remove('header_sticky');

    TweenMax.set(commonComponents.header.nRoot, { clearProps: 'yPercent' });
    commonComponents.header.nRoot.style.removeProperty('position');

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

export const appearAnimHeader = (delayS = 0) => new TimelineMax()
    .delay(delayS)
    .addLabel('start')
    .fromTo(
        commonComponents.header.nRoot,
        1,
        { autoAlpha: 0 },
        {
            autoAlpha: 1,
            clearProps: 'all',
        },
        'start+=0.5',
    );
