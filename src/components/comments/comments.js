import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize, emit, arrNodesFromHTML,
} from '../../common/js/helpers';
import PopupComment from '../popup-comment/popup-comment';
import EndlessBtn from '../endless-btn/endless-btn';

class Comments extends Component {
    constructor(nRoot) {
        super(nRoot, 'comments');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponent('popup-comment')) {
            this.popupComment = new PopupComment(nFindComponent('popup-comment'));
        }

        if (nFindComponent('endless-btn', this.nRoot)) {
            this.endlessBtn = new EndlessBtn(nFindComponent('endless-btn', this.nRoot), null, this.nFindSingle('wrapper'));
        }

        this.nTotal = this.nFindSingle('total');
        this.nBtn = this.nFindSingle('add-btn');
        this.nHeader = this.nFindSingle('header');
        this.nWrapper = this.nFindSingle('wrapper');
        this.click = this.click.bind(this);
        this.nBtn.addEventListener('click', this.click);

        this.addComment = this.addComment.bind(this);
        this.lastPageHandler = this.lastPageHandler.bind(this);
        listen('popup-comment:sent', this.addComment, this.popupComment.nRoot);
        listen('endless-btn:last-page', this.lastPageHandler, this.endlessBtn.nRoot);

        this.emptyHandler();
    }

    emptyHandler() {
        if (this.nFind('comment').length === 0) {
            this.nRoot.classList.add('comments_hide-btn');
        }
    }

    lastPageHandler() {
        this.nRoot.classList.add('comments_hide-btn');
    }

    click() {
        emit('popup-comment:show');
    }

    addComment(e) {
        this.nRoot.classList.remove('comments_hide-btn');
        this.emptyHandler();

        this.nWrapper.innerHTML = '';
        this.nTotal.innerHTML = e.detail.total;

        const commentsNodes = arrNodesFromHTML(e.detail.html);
        commentsNodes.forEach((node) => {
            this.nWrapper.appendChild(node);
        });

        if (e.detail.total === commentsNodes.length) {
            this.nRoot.classList.add('comments_hide-btn');
        }

        this.endlessBtn.nRoot.setAttribute('data-count-page', 1);
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

export default Comments;
