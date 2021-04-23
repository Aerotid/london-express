import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { nFindComponent } from '../../common/js/helpers';
import NotFound from '../../components/not-found/not-found';

Barba.BaseView.extend({
    namespace: '404',
    onEnter() {
    },
    async onEnterCompleted() {
        commonComponents.header.nRoot.classList.add('_contrast');
        await commonComponents.preloader.preloading;
        objectFitPolyfill();

        if (nFindComponent('not-found')) {
            this.notfound = new NotFound(nFindComponent('not-found'));
        }
    },
    onLeave() {
        commonComponents.header.nRoot.classList.remove('_contrast');
        if (this.notfound) this.notfound.destroy();
    },
    onLeaveCompleted() {

    },
}).init();
