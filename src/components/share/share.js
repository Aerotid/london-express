import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, addScript } from '../../common/js/helpers';

class Share extends Component {
    constructor(nRoot, shareContent = { url: window.location.href, title: document.querySelector('h1').textContent, imgUrl: document.querySelector('article img').src }) {
        super(nRoot, 'share');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        const scriptsSrc = ['https://yastatic.net/es5-shims/0.0.2/es5-shims.min.js', 'https://yastatic.net/share2/share.js'];
        Promise.all(scriptsSrc.map((src) => addScript(src))).then(() => {
            this.yaShare = Ya.share2(this.nRoot.querySelector('.ya-share2'), {
                content: {
                    url: shareContent.url,
                    title: shareContent.title,
                    image: shareContent.imgUrl
                }
            });
        });
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

export default Share;
