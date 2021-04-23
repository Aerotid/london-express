import Barba from 'barba.js/dist/barba.min';
import { commonComponents } from '../../common/js/commonComponents';
import { getDeviceType, nFindComponent, nFindComponents, nGetBody, vhMobileFix } from '../../common/js/helpers';
import Lead2 from '../../components/lead-2/lead-2';
import VideoBlock from '../../components/video-block/video-block';
import Slider from '../../components/slider/slider';
import { destroyShiftBottomAnim, prepareForShiftBottomAnim } from '../../components/header/animations';
import ClassFormat from '../../components/class-format/class-format';
import ListCircle from '../../components/list-circle/list-circle';
import LessonsGiftBanner from '../../components/lessons-gift-banner/lessons-gift-banner';
import Btn from '../../components/btn/btn';
import { prepareForAnimContent, initAppearAnimContent, destroyAppearAnimContent } from '../../common/js/contentAnimations';
import PropBlock from '../../components/prop-block/prop-block';
import {destroySideFormsAnim, prepareForSideFormsAppear} from "../../components/fixed-content/animations";

Barba.BaseView.extend({
    namespace: 'child-courses',
    onEnter() {

    },
    async onEnterCompleted() {
        if (getDeviceType() === 'desktop') prepareForAnimContent(this.container);
        vhMobileFix();

        prepareForSideFormsAppear(nGetBody(), window.innerHeight);
        prepareForSideFormsAppear(document.querySelector('.footer'), 1, true);

        await commonComponents.preloader.preloading;

        if (nFindComponent('lead-2')) {
            this.lead2 = new Lead2(nFindComponent('lead-2'), 1, '#FFFFFF');
        }

        if (nFindComponent('class-format')) {
            this.classFormat = new ClassFormat(nFindComponent('class-format'), 'scrollbar');
        }

        if (nFindComponent('video-block')) {
            this.videoBlock = new VideoBlock(nFindComponent('video-block'));
        }

        if (nFindComponent('slider')) {
            this.slider = new Slider(nFindComponent('slider'));
        }

        if (nFindComponent('list-circle')) {
            this.listCircle = new ListCircle(nFindComponent('list-circle'));
        }

        if (nFindComponent('lessons-gift-banner')) {
            this.lessons = new LessonsGiftBanner(nFindComponent('lessons-gift-banner'));
        }

        if (nFindComponent('btn')) {
            this.nBtns = nFindComponents('btn').map((btn) => new Btn(btn));
        }

        if (nFindComponent('prop-block')) {
            this.prop = new PropBlock(nFindComponent('prop-block'));
        }

        if (getDeviceType() === 'desktop') initAppearAnimContent(this.container);

        prepareForShiftBottomAnim(nGetBody(), window.innerHeight, true);
        objectFitPolyfill();
    },
    onLeave() {
        if (getDeviceType() === 'desktop') destroyAppearAnimContent();
        if (this.classFormat) this.classFormat.destroy();
        if (this.videoBlock) this.videoBlock.destroy();
        if (this.slider) this.slider.destroy();
        if (this.listCircle) this.listCircle.destroy();
        destroySideFormsAnim();
    },
    onLeaveCompleted() {
        destroyShiftBottomAnim();
        if (this.lead2) this.lead2.destroy();
    },
}).init();
