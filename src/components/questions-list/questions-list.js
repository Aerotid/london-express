import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents } from '../../common/js/helpers';
import Question from '../../components/question/question';
import EndlessBtn from '../../components/endless-btn/endless-btn';

class QuestionsList extends Component {
    constructor(nRoot) {
        super(nRoot, 'questions-list');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponents('question', this.nRoot)) {
            this.nQuestions = nFindComponents('question', this.nRoot).map((question) => new Question(question));
        }

        if (nFindComponent('endless-btn', this.nRoot)) {
            this.endLessBtn = new EndlessBtn(nFindComponent('endless-btn', this.nRoot));
            this.newQuestionsHandler = this.newQuestionsHandler.bind(this);
            listen('endless-btn:nodes-added', this.newQuestionsHandler, this.endLessBtn.nRoot);
        }
    }

    newQuestionsHandler(e) {
        e.detail.newNodsArr.forEach((newNod) => {
            this.nQuestions.push(new Question(newNod));
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
        if (this.nQuestions) this.nQuestions.forEach(item => item.destroy());
        if (this.endLessBtn) this.endLessBtn.destroy();
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default QuestionsList;
