import Component from '../../common/js/component';
import { listen, nFindComponent } from '../../common/js/helpers';
import SandwichMenuBtn from '../sandwich-menu-btn/sandwich-menu-btn';
import HeaderMenu from '../header-menu/header-menu';
import LanguageSelector from '../language-selector/language-selector';

class Header extends Component {
    constructor(nRoot) {
        super(nRoot, 'header');

        if (nFindComponent('sandwich-menu-btn', this.nRoot)) {
            this.sandwichButton = new SandwichMenuBtn(nFindComponent('sandwich-menu-btn', this.nRoot));
        }

        if (nFindComponent('header-menu', this.nRoot)) {
            this.headerMenu = new HeaderMenu(nFindComponent('header-menu', this.nRoot));
            this.headerMenu.setActiveLink();
        }

        if (nFindComponent('language-selector'), this.nRoot) {
            this.languageSelector = new LanguageSelector(nFindComponent('language-selector', this.nRoot));
        }

        //TweenMax.set(this.nRoot, { yPercent: -100 });
        this.show = this.show.bind(this);
        listen('preloaderAnimation:header', this.show);
        //this.show();
    }

    show() {
        TweenMax.to(this.nRoot, 0.5, { yPercent: 0, ease: Linear.easeInOut });
    }

    destroy() {
        this.sandwichButton.destroy();
    }
}

export default Header;
