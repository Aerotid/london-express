import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nGetBody } from '../../common/js/helpers';
import Pagination from '../../components/pagination/pagination';
import BlogNew from '../../components/blog-new/blog-new';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";
import NewsMain from '../../components/news-main/news-main';

Barba.BaseView.extend({
    namespace: 'news',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);

        await commonComponents.preloader.preloading;
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        commonComponents.header.nRoot.classList.add('_contrast');
        if (nFindComponent('pagination')) {
            this.pagination = new Pagination(nFindComponent('pagination'));
        }

        if (nFindComponent('blog-new')) {
            this.newslist = new BlogNew(nFindComponent('blog-new'));
        }

        if (nFindComponent('news-main')) {
            this.newsMain = new NewsMain(nFindComponent('news-main'));
        }
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        commonComponents.header.nRoot.classList.remove('_contrast');
        if (this.pagination) this.pagination.destroy();
        if (this.newslist) this.newslist.destroy();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        if (this.newsMain) this.newsMain.destroy();
        destroyShiftBottomAnim();
    },
}).init();
