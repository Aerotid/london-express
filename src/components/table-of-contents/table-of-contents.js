import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import scrollToPlugin from 'gsap/src/minified/plugins/ScrollToPlugin.min';
import {ANIM_Y_PERCENT} from '../../common/js/variables';

const plugin = { scrollToPlugin };

class TableOfContents extends Component {
    constructor(nRoot) {
        super(nRoot, 'table-of-contents');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.titles = [...document.querySelectorAll('.table-of-contents__content-section-wrapper h3')];
        this.list = this.nFindSingle('list');
        this.addListItem = this.addListItem.bind(this);
        this.titles.forEach((title) => { this.addListItem(title); });

        this.scroll = this.scroll.bind(this);
        [...this.list.querySelectorAll('a')].forEach((a) => a.addEventListener('click', this.scroll));
    }

    addListItem(title) {
        const id = title.textContent.replace(/&nbsp;|\s|'|"/g, '_');
        title.id = id;
        this.list.innerHTML += `<li class="table-of-contents__item"><a href="#${title.id}">${title.textContent}</a>`;
    }

    scroll(e) {
        e.preventDefault();
        const maxTime = 2;
        const minTime = 0.4;
        let offset = document.querySelector('.header').offsetHeight + 20;
        const target = document.querySelector(e.target.getAttribute('href'));
        const posTop = target.offsetTop - offset;
        const distance = Math.abs(e.target.offsetTop - posTop);
        const ratio = distance / document.body.scrollHeight;
        const time = maxTime * ratio;
        const tl = new TimelineLite();
        if (getDeviceType() === 'desktop') {
            if (getDeviceType() === 'desktop' && target.parentElement.getAttribute('data-anim') === 'anim-3' && target.parentElement.style.transform) {
                tl.eventCallback('onStart', () => { TweenLite.set(target.parentElement, { yPercent: ANIM_Y_PERCENT }); });
                offset += target.parentElement.offsetHeight * (ANIM_Y_PERCENT/100);
            }
        }
        tl.to(window, time > minTime ? time : minTime, { scrollTo: { y: e.target.getAttribute('href'), offsetY: offset } });
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'mobile') {
                this.destroyDesktop();
                this.initMobile();
            } else if (this.currentDevice === 'mobile') {
                this.destroyMobile();
                this.initDesktop();
            }
            this.currentDevice = getDeviceType();
        }
    }

    destroyDesktop() {

    }

    destroyMobile() {

    }

    destroy() {
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default TableOfContents;
