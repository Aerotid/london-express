import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import { getDeviceType, nFindComponent, nGetBody } from '../../common/js/helpers';
import Submenu from '../../components/submenu/submenu';
import BlogNew from '../../components/blog-new/blog-new'
import Subscription from '../../components/subscription/subscription';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'blog-section',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        if (nFindComponent('submenu')) {
            this.submenu = new Submenu(nFindComponent('submenu'));
        }
        if (nFindComponent('subscription')) {
            this.subscribeForm = new Subscription(nFindComponent('subscription'));
        }
        commonComponents.header.nRoot.classList.add('_contrast');
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        if (nFindComponent('blog-new')) {
            this.blogNew = new BlogNew(nFindComponent('blog-new'));
        }
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        destroySideFormsAnim();
        commonComponents.header.nRoot.classList.remove('_contrast');
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
