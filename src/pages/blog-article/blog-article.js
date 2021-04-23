import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nGetBody } from '../../common/js/helpers';
import Subscription from '../../components/subscription/subscription';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import ArticleBlog from '../../components/article-blog/article-blog';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import Article from '../../components/article/article';

Barba.BaseView.extend({
    namespace: 'blog-article',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        commonComponents.header.nRoot.classList.add('_contrast');
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);
        await commonComponents.preloader.preloading;

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        objectFitPolyfill();

        if (nFindComponent('article-blog')) {
            this.contents = new ArticleBlog(nFindComponent('article-blog'));
        }

        if (nFindComponent('subscription')) {
            this.subscribeForm = new Subscription(nFindComponent('subscription'));
        }
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        commonComponents.header.nRoot.classList.remove('_contrast');
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        if (this.contents) this.contents.destroy();
        destroyShiftBottomAnim();
    },
}).init();
