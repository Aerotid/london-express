import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import { getDeviceType, nFindComponent, nGetBody, parseQuery } from '../../common/js/helpers';
import Submenu from '../../components/submenu/submenu';
import BlogPopular from '../../components/blog-popular/blog-popular'
import BlogNew from '../../components/blog-new/blog-new'
import Subscription from '../../components/subscription/subscription';
import Notification from '../../components/notification/notification';
import { destroyAppearAnimContent, initAppearAnimContent, prepareForAnimContent } from '../../common/js/contentAnimations';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'blog',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        if (nFindComponent('submenu')) {
            this.submenu = new Submenu(nFindComponent('submenu'));
        }
        if (nFindComponent('blog-popular')) {
            this.blogPopular = new BlogPopular(nFindComponent('blog-popular'));
        }
        if (nFindComponent('subscription')) {
            this.subscribeForm = new Subscription(nFindComponent('subscription'));
        }
        commonComponents.header.nRoot.classList.add('_contrast');
        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (nFindComponent('notification_subscribe')) {
            this.notificationSubscribed = new Notification(nFindComponent('notification_subscribe'));
        }

        if (nFindComponent('notification_unsubscribe')) {
            this.notificationUnsubscribed = new Notification(nFindComponent('notification_unsubscribe'));
        }

        const queryVars = parseQuery();
        if(queryVars.CONFIRM_CODE) {
            if (queryVars.action === 'unsubscribe') {
                if (this.notificationUnsubscribed) this.notificationUnsubscribed.show();
            } else {
                if (this.notificationSubscribed) this.notificationSubscribed.show();
            }
        }

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);
        if (nFindComponent('blog-new')) {
            this.blogNew = new BlogNew(nFindComponent('blog-new'));
        }
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        commonComponents.header.nRoot.classList.remove('_contrast');
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
    },
}).init();
