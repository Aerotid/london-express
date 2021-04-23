import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import TableOfContents from '../table-of-contents/table-of-contents';
import VideoBlock from '../video-block/video-block';
import PostStats from '../post-stats/post-stats';
import Comments from '../comments/comments';
import Article from '../article/article';

class ArticleBlog extends Component {
    constructor(nRoot) {
        super(nRoot, 'article-blog');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponent('article', this.nRoot)) {
            this.article = new Article(nFindComponent('article', this.nRoot));
        }

        if (nFindComponent('table-of-contents')) {
            this.contents = new TableOfContents(nFindComponent('table-of-contents'));
        }

        if (nFindComponent('video-block')) {
            this.video = new VideoBlock(nFindComponent('video-block'));
        }

        if (nFindComponent('post-stats')) {
            this.stats = new PostStats(nFindComponent('post-stats'));
        }

        if (nFindComponent('comments')) {
            this.comments = new Comments(nFindComponent('comments'));
        }
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
        if (this.article) this.article.destroy();
    }
}

export default ArticleBlog;
