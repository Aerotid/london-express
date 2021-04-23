import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { loadImages, nGetBody, delay, isDirectEnter, emit, listen, unlisten, getDeviceType, loadImportantMedia } from '../../common/js/helpers';
import Component from '../../common/js/component';
import debounce from 'lodash.debounce';
import { DEBOUNCE_INTERVAL_MS } from '../../common/js/variables';
import {Power1} from "gsap";

class Preloader extends Component {
    constructor(nRoot) {
        super(nRoot, 'preloader');

        loadImages();
        this.preloading = () => {};
        // this.nImgWrapper = this.nFindSingle('img');
        // this.nImg = this.nImgWrapper.querySelector('img');
        // this.nProgress = this.nFindSingle('progress');
        //
        // if (this.nImg.complete) {
        //     this.nImgWrapper.classList.add('smooth-show');
        // } else {
        //     this.nImg.addEventListener('load', () => {
        //         this.nImg.classList.add('smooth-show');
        //     });
        // }
        // this.done = false;
        //
        // this.loadingAnimation = this.loadingAnimation.bind(this);
        //
        // listen('preloaderCounter:update', this.loadingAnimation);
        //
        // this.preloading = Promise.race([
        //     this.playbackOverPromise(),
        //     this.timerIfNotLoadingImages()
        // ])
        //     .then(() => delay(1000))
        //     .then(() => {
        //         this.nRoot.classList.add('smooth-hide');
        //         objectFitPolyfill();
        //     })
        //     .then(() => delay(500))
        //     .then(() => {
        //         emit('preloaderAnimation:header');
        //         this.nFindSingle('img').classList.add('preloader__img_stop');
        //         this.hide();
        //     });
    }

    timerIfNotLoadingImages() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, 9000);
        });
    }

    async playbackOverPromise() {
        await Promise.all([
            loadImages(),
            commonComponents.lazyLoad.update(),
        ]);
    }

    loadingAnimation(e) {
        const percent = e.detail.value;

        cancelAnimationFrame(this.animID);
        this.animID = requestAnimationFrame(() => this.nProgress.style.width = `${percent}%`);
    }

    hide() {
        this.done = true;
        nGetBody().classList.remove('preloading');
        nGetBody().style.removeProperty('height');
        if (!Barba.HistoryManager.prevStatus()) document.body.classList.add('preload-done');
        emit('preloader:complete');
    }

    destroy() {
        unlisten('preloaderCounter:update', this.loadingAnimation);
    }
}

export default Preloader;
