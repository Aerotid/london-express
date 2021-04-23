import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, Resize, nodeFromHTML } from '../../common/js/helpers';
import axios from 'axios/dist/axios.min';

class PostStats extends Component {
    constructor(nRoot) {
        super(nRoot, 'post-stats');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.nlikeBtn = this.nFindSingle('like');
        this.id = this.nlikeBtn.id.split('_').pop();
        this.nlikeCountSpan = this.nFindSingle('count_like');
        this.likeCount = +this.nlikeCountSpan.textContent;

        this.toggleLike = this.toggleLike.bind(this);
        this.toggleLike(0);
        this.nlikeBtn.addEventListener('click', this.toggleLike);
    }

    toggleLike(count = 1) {
        axios.get(`${window.location.origin}/local/components/only/vote_like_dislike/ajax.php?element_id=${this.id}&vote_like_dislike=${count}&iblock_id=${this.nlikeBtn.getAttribute('data-iblock-id')}&template=blog`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            responseType: 'text',
        })
            .then(({data, status}) => {
                if (status === 200)  {
                    const node = nodeFromHTML(data);
                    this.nlikeBtn.parentNode.replaceChild(node, this.nlikeBtn);
                    this.nlikeBtn = node;
                    this.nlikeBtn.addEventListener('click', this.toggleLike);
                }
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

export default PostStats;
