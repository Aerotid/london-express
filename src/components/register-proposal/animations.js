import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min';
import {commonComponents} from '../../common/js/commonComponents';
import 'scrollmagic/scrollmagic/minified/plugins/animation.gsap.min.js';
import {offset} from '../../common/js/helpers';

let scene, sceneLastWork, sceneUpcomingLesson, sceneNotice, sceneNotebook, sceneCircleLeft, sceneCircleRight;

export const registerProposalAnim = (component) => {
    if (!scene) {

        scene = new ScrollMagic.Scene({
            triggerElement: component.overlay,
            duration: offset(component.overlay).height,
            triggerHook: 0.5,
            offset: 0
        })
            .setTween(new TimelineMax ()
                .add([
                    TweenMax.fromTo(component.circleLeft, 1, {y: 0}, {y: `-${offset(component.overlay).height / 1.5}`, ease: Linear.easeNone}),
                    TweenMax.fromTo(component.circleRight, 1, {y: 0}, {y: `${offset(component.overlay).height / 1.1}`, ease: Linear.easeNone}),
                    TweenMax.fromTo(component.lastWork, 1, {y: 0}, {y: `-${offset(component.overlay).height / 5}`, ease: Linear.easeNone}),
                    TweenMax.fromTo(component.notice, 1, {y: 0}, {y: `-${offset(component.overlay).height / 6}`, ease: Linear.easeNone}),
                    TweenMax.fromTo(component.upcomingLesson, 1, {y: 0}, {y: `-${offset(component.overlay).height / 4}`, ease: Linear.easeNone})
                ]))
            // .addIndicators()
            .addTo(commonComponents.ctrl);

        sceneLastWork = new ScrollMagic.Scene({
            triggerElement: component.lastWork,
            triggerHook: 0.7,
            offset: 0
        })
            .on('enter', () => {
                component.lastWork.querySelector('.last-work').classList.add('animated');
            })
            // .addIndicators()
            .addTo(commonComponents.ctrl);

        sceneUpcomingLesson = new ScrollMagic.Scene({
            triggerElement: component.upcomingLesson,
            triggerHook: 0.7,
            offset: 0
        })
            .on('enter', () => {
                component.upcomingLesson.querySelector('.upcoming-lesson').classList.add('animated');
            })
            // .addIndicators()
            .addTo(commonComponents.ctrl);

        sceneNotice = new ScrollMagic.Scene({
            triggerElement: component.notice,
            triggerHook: 0.8,
            offset: 0
        })
            .on('enter', () => {
                component.notice.querySelector('.notice').classList.add('animated');
            })
            // .addIndicators()
            .addTo(commonComponents.ctrl);

        sceneNotebook = new ScrollMagic.Scene({
            triggerElement: component.noteBook,
            triggerHook: 0.95,
        })
            .on('enter', () => {
                component.noteBook.classList.add('animated');
            })
            // .addIndicators()
            .addTo(commonComponents.ctrl);

        sceneCircleLeft = new ScrollMagic.Scene({
            triggerElement: component.circleLeft,
            triggerHook: 0.7,
        })
            .on('enter', () => {
                component.circleLeft.classList.add('animated');
            })
            // .addIndicators()
            .addTo(commonComponents.ctrl);

        sceneCircleRight = new ScrollMagic.Scene({
            triggerElement: component.circleRight,
            triggerHook: 0.85,
        })
            .on('enter', () => {
                component.circleRight.classList.add('animated');
            })
            // .addIndicators()
            .addTo(commonComponents.ctrl);
    } else {
        scene.enabled(true);
    }
};


export const destroyRegisterProposalAnim = () => {
    if (scene) {
        scene.enabled(false);
        scene.destroy();
        scene = null;
    }
};
