import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, emit } from '../../common/js/helpers';
import scrollToPlugin from 'gsap/src/minified/plugins/ScrollToPlugin.min';

const plugin = { scrollToPlugin };

class Btn extends Component {
    constructor(nRoot, nParent) {
        super(nRoot, 'btn');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        this.nParent = nParent;

        this.scroll = this.scroll.bind(this);
        if (this.nRoot.getAttribute('href') && this.nRoot.getAttribute('href').match(/#.+/)) {
            this.nRoot.addEventListener('click', this.scroll);
        }

        if (this.nRoot.hasAttribute('data-add-container')) {
            this.container = (this.nParent ? this.nParent : document).querySelector(this.nRoot.getAttribute('data-add-container'));
            this.child = this.container.children[0];
            let inputs = this.child.querySelectorAll('input, textarea, select');
            inputs = [...inputs].map((input) => {
                input.id += '-1';
                //input.name += '-1';
                return input;
            });
            this.count = 1;
            this.addNodes = this.addNodes.bind(this);
            this.nRoot.addEventListener('click', this.addNodes);
        }
    }

    scroll(e) {
        e.preventDefault();
        const maxTime = 2;
        const minTime = 0.4;
        const posTop = document.querySelector(this.nRoot.getAttribute('href')).offsetTop - document.querySelector('.header').offsetHeight - 20;
        const distance = Math.abs(this.nRoot.offsetTop - posTop);
        const ratio = distance / document.body.scrollHeight;
        const time = maxTime * ratio;
        TweenLite.to(window, time > minTime ? time : minTime, { scrollTo: { y: this.nRoot.getAttribute('href'), offsetY: document.querySelector('.header').offsetHeight + 20} });
    }

    addNodes() {
        this.count += 1;
        const newNode = this.child.cloneNode(true);
        let inputs = newNode.querySelectorAll('input, textarea, select');
        inputs = [...inputs].map((input) => {
            input.value = '';
            input.id = input.id.slice(0, -1) + this.count;
            //input.name = input.name.slice(0, -1) + this.count;
            return input;
        });
        newNode.classList.add('new-node-animate');
        this.container.appendChild(newNode);
        emit('addedChild', { newNode });
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

export default Btn;
