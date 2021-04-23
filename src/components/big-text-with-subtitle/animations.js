import ScrollMagic from 'scrollmagic/scrollmagic/minified/ScrollMagic.min.js';
import { commonComponents } from '../../common/js/commonComponents';

let scenes = [];

export const initAnim = (nRoot, start) => {
    scenes.push(new ScrollMagic.Scene({
        triggerElement: nRoot,
        triggerHook: 0.8,
    })
        .on("enter", function () {
            start();
        })
        .reverse(false)
        .addTo(commonComponents.ctrl));
};

export const destroyAnim = () => {
    scenes.forEach(scene => scene.destroy());
    scenes = [];
};
