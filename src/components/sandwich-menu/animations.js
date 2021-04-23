import {getDeviceType, nGetBody} from "../../common/js/helpers";
import {commonComponents} from "../../common/js/commonComponents";

const nHeader = document.querySelector('.header');
const nHeaderPhone = nHeader.querySelector('.header__phone');
const nHeaderFree = nHeader.querySelector('.header__free');
const nHeaderMenu = nHeader.querySelector('.header-menu');
const nSandwichMenu = document.querySelector('.sandwich-menu');
const nWrapper = nSandwichMenu.querySelector('.sandwich-menu__wrapper');
const nMainMenuItems = nSandwichMenu.querySelectorAll('.sandwich-menu__main-menu-item');
const nSubmenuItems = nSandwichMenu.querySelectorAll('.sandwich-menu__submenu-item');
const nFigure = nSandwichMenu.querySelector('.sandwich-menu__figure img');

const nSandwichTop = nSandwichMenu.querySelector('.sandwich-menu__top');
const nSubmenu = nSandwichMenu.querySelector('.sandwich-menu__submenu');
const nMainMenu = nSandwichMenu.querySelector('.sandwich-menu__main-menu');
const nBody = nGetBody();

export const arriveAnimation = (onStart, onComplete) => {
    commonComponents.header.nRoot.style.position = 'fixed';
    if (getDeviceType() === 'desktop') {
        const tl = new TimelineLite({onStart: onStart, onComplete: onComplete})
            .set(nMainMenu, { clearProps: 'opacity' })
            .set(nSubmenu, { clearProps: 'opacity' })
            .set(nSandwichMenu, { backgroundColor: 'rgba(24,24,24,0.2)', visibility: 'visible' })
            .set(nHeader, {backgroundColor: '#FAF8F8', delay: 0.1}, '<')
            .staggerTo([nHeaderPhone, nHeaderFree, nHeaderMenu], 0.3, {opacity: 0}, '<')
            .to(nWrapper, 0.6, { y: '0%', ease: Power4.easeOut }, '<')
            .addLabel('opened', '>')
            .staggerTo(nMainMenuItems, 0.4, { opacity: 1, transform: 'translateY(0%)' }, 'opened')
            .staggerTo(nSubmenuItems, 0.4, { opacity: 1, transform: 'translateY(0%)' })
            .to(nFigure, 0.4, { opacity: 1 }, 'opened')
            .to(nFigure, 0.8, { transform: 'translate(0%, 0%)', xPercent: 0, ease: Power1.easeInOut }, 'opened');
        TweenMax.to(nFigure, 0.8, { delay: 0.8, transform: 'translate(0%, 3%)', ease: Power1.easeInOut, repeat: -1, yoyo: true });
    } else {
        const tl = new TimelineLite({onStart: onStart, onComplete: onComplete})
            .set([nSubmenuItems, nMainMenuItems], { opacity: 1, transform: 'translateY(0)' })
            .set([nSubmenu, nMainMenu, nSandwichTop], { opacity: 0, transform: 'translateY(2rem)' })
            .set(nSandwichMenu, {  visibility: 'visible' })
            .set(nHeader, {backgroundColor: '#FAF8F8', delay: 0.1}, '<')
            .to(nHeaderFree, 0.3, {opacity: 0}, '<')
            .to(nWrapper, 0.7, { transform: 'translateY(0%)', ease: Power4.easeOut }, '<')
            .staggerTo([nSubmenu, nMainMenu, nSandwichTop], 0.3, { opacity: 1, transform: 'translateY(0%)' })
    }
};

export const leaveAnimation = (onStart, onComplete) => {
    if (getDeviceType() === 'desktop') {
        const tl = new TimelineLite({onComplete: onComplete, onStart: onStart})
            .staggerTo([nFigure, nMainMenuItems, nSubmenuItems], 0.3, {opacity: 0})
            .set(nHeader, { clearProps: 'backgroundColor' })
            .to(nWrapper, 0.6, { y: '-100%' }, '<')
            .set(nFigure, { transform: 'translate(-200%, 100%)' })
            .set([nMainMenuItems, nSubmenuItems], { transform: 'translateY(100%)' })
            .set(nFigure, { transform: 'translate(-200%, 100%)' })
            .staggerTo([nHeaderPhone, nHeaderFree, nHeaderMenu], 0.3, {opacity: 1}, '<')
            .set(nSandwichMenu, { clearProps: 'backgroundColor' }, '<')
            .set(nSandwichMenu, { visibility: 'hidden'});
    } else {
        const tl = new TimelineLite({onComplete: onComplete, onStart: onStart})
            .staggerTo([ nMainMenu, nSubmenu, nSandwichTop], 0.3, {opacity: 0})
            .set(nHeader, { clearProps: 'backgroundColor' })
            .to(nWrapper, 0.4, { transform: 'translateY(-100%)' }, '<')
            .set([nMainMenu, nSubmenu, nSandwichTop], { transform: 'translateY(2rem)' })
            .to(nHeaderFree, 0.3, {opacity: 1}, '<')
            .set(nSandwichMenu, { visibility: 'hidden' } );
    }
};
