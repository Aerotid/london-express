import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import NewsSlider from '../../components/news-slider/news-slider';
import { getDeviceType, nFindComponent, nGetBody } from '../../common/js/helpers';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import Article from '../../components/article/article';

Barba.BaseView.extend({
    namespace: 'news-article',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        commonComponents.header.nRoot.classList.add('_contrast');

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        objectFitPolyfill();
        if (nFindComponent('news-slider')) {
            this.newsslider = new NewsSlider(nFindComponent('news-slider'));
        }

        if (nFindComponent('article', this.nRoot)) {
            this.article = new Article(nFindComponent('article', this.nRoot));
        }
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        commonComponents.header.nRoot.classList.remove('_contrast');
        if (this.newsslider) this.newsslider.destroy();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
        if (this.article) this.article.destroy();
    },
}).init();
