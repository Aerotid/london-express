import PerfectScrollbar from 'perfect-scrollbar';
import Component from '../../common/js/component';
import { listen, getOS, nFindComponent } from '../../common/js/helpers';
import debounce from 'lodash.debounce';
import { arriveAnimation, leaveAnimation } from './animations';
import LanguageSelector from '../language-selector/language-selector';

class SandwichMenu extends Component {
    constructor(nRoot) {
        super(nRoot, 'sandwich-menu');
        this.isAnimationComplete = true;
        this.onStart = this.onStart.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        const ps = new PerfectScrollbar(this.nFindSingle('menu-container'), {
            wheelSpeed: 2,
            wheelPropagation: false,
            minScrollbarLength: 20,
            scrollYMarginOffset: 0
        });
        listen('sandwichMenu:open', this.update);
        this.update = debounce(ps.update, 35);
        window.addEventListener('resize', this.update);
        listen('sandwichMenu:open', this.open);
        listen('sandwichMenu:close', this.close);

        if (nFindComponent('language-selector'), this.nRoot) {
            this.languageSelector = new LanguageSelector(nFindComponent('language-selector', this.nRoot));
        }

        this.nMainMenuItems = this.nFind('main-menu-item');
        this.nSubMmenuItems = this.nFind('submenu-item');
        this.setActiveLink();
    }

    setActiveLink() {
        let setActiveForGroup = (group, activeClass) => {
            group.forEach((item) => {
                const link = item.querySelector('a');
                if (link.href === window.location.href ||
                    link.pathname.split('/')[1] === window.location.pathname.split('/')[1] && link.pathname.split('/')[1] !== '') {
                    item.classList.add(activeClass);
                }
            });
        }

        setActiveForGroup(this.nMainMenuItems, 'sandwich-menu__main-menu-item_active');
        setActiveForGroup(this.nSubMmenuItems, 'sandwich-menu__submenu-item_active');
    }

    resetActiveLink() {
        this.nMainMenuItems.forEach((item) => {
            item.classList.remove('sandwich-menu__main-menu-item_active');
        });

        this.nSubMmenuItems.forEach((item) => {
            item.classList.remove('sandwich-menu__submenu-item_active');
        });
    }

    open() {
        arriveAnimation(this.onStart, this.onComplete);
    }

    close() {
        leaveAnimation(this.onStart, this.onComplete);
    }

    onStart() {
        this.isAnimationComplete = false;
    }

    onComplete() {
        this.isAnimationComplete = true;
    }

    destroy() {

    }
}

export default SandwichMenu;
