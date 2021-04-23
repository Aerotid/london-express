import { commonComponents } from './commonComponents';
import {
    loadImages, nGetBody, emit,
} from './helpers';

const defaultTransition = (transition) => {
    // if (nGetBody()
    //     .classList
    //     .contains('sandwich-open')) {
    //     commonComponents.sandwichMenu.sandwichMenuClose.close(false);
    // }
    // commonComponents.header.addContrastClass();

    // commonComponents.lazyLoadCountProgress = 0;

    if (nGetBody().classList.contains('sandwich-open')) {
        emit('sandwichMenu:close');
    }

    commonComponents.lazyLoad.update();
    loadImages();
    new TimelineLite()
        .to(
            transition.oldContainer,
            1,
            {
                autoAlpha: 0,
                onComplete: () => {
                    commonComponents.callbacks.call('beforeOldContainerRemove');

                    commonComponents.header.headerMenu.resetActiveLink();
                    commonComponents.sandwichMenu.resetActiveLink();

                    commonComponents.popupFree.base.removeTriggers();
                    if (commonComponents.popupFree.base.isOpened()) {
                        commonComponents.popupFree.base.toggle();
                    }

                    commonComponents.popupSubscription.base.findTriggers();
                    if (commonComponents.popupSubscription.base.isOpened()) {
                        commonComponents.popupSubscription.base.toggle();
                    }

                    transition.done.bind(transition)();
                },
            },
        )
        .fromTo(
            transition.newContainer,
            1,
            { autoAlpha: 0 },
            {
                autoAlpha: 1,
                onComplete: () => {
                    commonComponents.header.headerMenu.setActiveLink();
                    commonComponents.sandwichMenu.setActiveLink();
                    commonComponents.popupFree.base.findTriggers();
                    commonComponents.popupSubscription.base.findTriggers();
                },
            },
        );

    // listen('preloader:complete', () => {
    //     console.log('barba transition 2');
    //     new TimelineLite()
    //         .fromTo(
    //             transition.newContainer,
    //             0.5,
    //             { autoAlpha: 0 },
    //             { autoAlpha: 1,
    //                 onComplete: () => {
    //                     commonComponents.popupFree.base.findTriggers();
    //                     commonComponents.popupSubscription.base.findTriggers();
    //                 }
    //             }
    //         );
    // });
};

const transitions = {};

const namespaceSubstitute = {};

export default (source, target) => (transitions[source] && transitions[source][target])
    || (transitions[source] && transitions[source][namespaceSubstitute[target]])
    || (transitions[namespaceSubstitute[source]] && transitions[namespaceSubstitute[source]][target])
    || (
        transitions[namespaceSubstitute[source]]
        && transitions[namespaceSubstitute[source]][namespaceSubstitute[target]])
    || defaultTransition;
