import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js';
import {commonComponents} from '../../common/js/commonComponents';
import {ANIM_Y, ANIM_Y_PERCENT} from '../../common/js/variables';
import {isDirectEnter, offset} from '../../common/js/helpers';

let scenes = [];
let triggers = null;
let triggersDuration = null;
let styles = null;
let delayLetter = 0;

const triggersBelowTheFoldIfDirectEnter = (nodeArr) => {
    return isDirectEnter() ? [...nodeArr].filter(node => node.getBoundingClientRect().top + window.scrollY > window.innerHeight) : [...nodeArr];
};

export const prepareForAnimContent = (nRoot) => {
    const tl = new TimelineMax();

    if ([...nRoot.querySelectorAll('[data-anim="anim-1"]')].length !== 0) {
        tl.set(triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-1"]')), { opacity: 0, y: ANIM_Y });
    }
    if ([...nRoot.querySelectorAll('[data-anim="anim-2"]')].length !== 0) {
        tl.set(triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-2"]')), {opacity: 0, y: ANIM_Y});
    }
    if ([...nRoot.querySelectorAll('[data-anim="anim-3"]')].length !== 0) {
        tl.set(triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-3"]')), {opacity: 0, yPercent: ANIM_Y_PERCENT});
    }
    if ([...nRoot.querySelectorAll('[data-anim="anim-scale"]')].length!== 0) {
        tl.set(triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-scale"]')), { transform: 'matrix(0.9, 0, 0, 0.9, 0, 0)', opacity: 0.4 });
    }
};

export const initAppearAnimContent = (nRoot) => {
    const nTriggers = [];

    if ([...nRoot.querySelectorAll('[data-anim="trigger"]')].length!== 0) {
        triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="trigger"]')).forEach(trigger => nTriggers.push(trigger));
    }
    if ([...nRoot.querySelectorAll('[data-anim="anim-1"]')].length !== 0) {
        triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-1"]')).forEach(trigger => nTriggers.push(trigger));
    }
    if ([...nRoot.querySelectorAll('[data-anim="anim-3"]')].length !== 0) {
        triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-3"]')).forEach(trigger => nTriggers.push(trigger));
    }
    if ([...nRoot.querySelectorAll('[data-anim="anim-circle"]')].length !== 0) {
        triggersBelowTheFoldIfDirectEnter(nRoot.querySelectorAll('[data-anim="anim-circle"]')).forEach(trigger => nTriggers.push(trigger));
    }

    triggers = nTriggers.map((nTrigger) => {

        scenes.push(new ScrollMagic.Scene({
            triggerElement: nTrigger,
            triggerHook: nTrigger.hasAttribute('data-hook') ? nTrigger.getAttribute('data-hook') : 0.91,
        })
            .setTween(() => {
                const tl = new TimelineMax();
                if (nTrigger.getAttribute('data-anim') === 'trigger') {
                    tl.staggerTo(nTrigger.querySelectorAll('[data-anim="anim-2"]'), 0.6, {opacity: 1, y: 0, clearProps: 'all'}, 0.2, 0);
                }
                if (nTrigger.getAttribute('data-anim') === 'anim-1') {
                    tl.to(nTrigger, 0.5, { opacity: 1, y: 0, clearProps: 'all', }, 0);
                }
                if (nTrigger.getAttribute('data-anim') === 'anim-3') {
                    tl.to(nTrigger, 0.8, {opacity: 1, yPercent: 0, clearProps: 'all'}, '+=0.1')
                }
                if (nTrigger.getAttribute('data-anim') === 'anim-circle') {
                    tl.to(nTrigger, 1, {className: "-=hide"})
                }
            })
            .reverse(false)
            // .addIndicators()
            .addTo(commonComponents.ctrl));

    });

    const nTriggersDuration = [];

    if ([...nRoot.querySelectorAll('[data-anim="anim-scale"]')].length!== 0) nTriggersDuration.push(...nRoot.querySelectorAll('[data-anim="anim-scale"]'));
    if ([...nRoot.querySelectorAll('[data-anim="anim-parallax"]')].length!== 0) nTriggersDuration.push(...nRoot.querySelectorAll('[data-anim="anim-parallax"]'));

    triggersDuration = nTriggersDuration.map((triggerDuration) => {
        if (triggerDuration.getAttribute('data-anim') === 'anim-scale') {
            styles = TweenMax.to(triggerDuration, 1, {opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)'})
        }
        if (triggerDuration.getAttribute('data-anim') === 'anim-parallax') {
            styles = TweenMax.fromTo(triggerDuration, 1, {y: 0}, {y: `-${offset(triggerDuration).height / 10}`, ease: Linear.easeNone})
        }
        scenes.push(new ScrollMagic.Scene({
            triggerElement: triggerDuration,
            duration: triggerDuration.getAttribute('data-duration') ? triggerDuration.getAttribute('data-duration') : offset(triggerDuration).height,
            triggerHook: triggerDuration.getAttribute('data-hook') ? triggerDuration.getAttribute('data-hook') : 0.8,
        })
            .setTween(new TimelineMax ()
                .add([styles]))
            // .addIndicators()
            .addTo(commonComponents.ctrl));
    });
};

export const destroyAppearAnimContent = () => {
    scenes.forEach(scene => scene.destroy());
    scenes = [];
    triggers = [];
};
