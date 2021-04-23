import Component from '../../common/js/component';
import {getDeviceType, listen, unlisten, nFindComponent, Resize} from '../../common/js/helpers';
// import AttachFileList from '../attach-file-list/attach-file-list';

class AttachFile extends Component {
    constructor(nRoot) {
        super(nRoot, 'attach-file');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.nFile = this.nFindSingle('input');
        this.nButtonText = this.nFindSingle('text');
        this.oldTitle = this.nFindSingle('text').innerHTML;

        this.validateFile = this.validateFile.bind(this);
        this.nFile.addEventListener('change', this.validateFile);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);
    }

    getName() {
        return this.nFile.getAttribute('name');
    }

    getFiles() {
        return this.nFile.files;
    }

    clearFiles() {
        if (this.nFile.files.length > 0) {
            this.nRoot.classList.remove('fill');
            this.nButtonText.innerHTML = this.oldTitle;
            [...this.nFile.files].forEach(file => file = '');
        }
    }

    changeLengthName(name) {
        this.validateName = '';
        this.ext = '';

        this.maxLenth = 13;
        this.indexOf = name.lastIndexOf('.');

        if (name.length > this.maxLenth) {
            for (let i = 0; i < this.maxLenth - 4; i++) {
                this.validateName += name[i];
            }
        } else {
            return name;
        }

        for (let i = this.indexOf; i < name.length; i++) {
            this.ext += name[i];
        }

        return `${this.validateName}..${this.ext}`;
    }

    validateFile() {
        if (this.nFile.files.length > 0) {
            this.nRoot.classList.add('fill');
            if (this.nFile.files.length > 1) {
                this.nButtonText.innerHTML = `Файлов (${this.nFile.files.length})`;
            } else {
                this.fileText = this.changeLengthName(this.nFile.files[0].name);
                this.nButtonText.innerHTML = this.fileText;
            }
        }
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'desktop') {
                this.destroyMobile();
                this.initDesktop();
            } else if (this.currentDevice === 'desktop') {
                this.destroyDesktop();
                this.initMobile();
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

export default AttachFile;
