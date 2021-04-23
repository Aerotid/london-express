import Component from '../../common/js/component';
import {
    getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents, emit
} from '../../common/js/helpers';
import BtnExpand from '../btn-expand/btn-expand';
import Input from '../input/input';
import AttachFile from '../attach-file/attach-file';
import ContactButton from '../contact-button/contact-button';
import Btn from '../btn/btn';
import axios from 'axios/dist/axios.min';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import Notification from "../notification/notification";
import 'bootstrap.native/dist/polyfill';
import Collapse from 'bootstrap.native/dist/components/collapse-native';

class PopupVacancyQuestionnaire extends Component {
    constructor(nRoot, isAttachment = false) {
        super(nRoot, 'popup-vacancy-questionnaire');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.bsCollapses = this.nFind('expand-btn').map(btn => new Collapse(btn));

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        this.isAttachment = isAttachment;

        this.toggle = this.toggle.bind(this);
        listen('popupQuestionnaire:show', this.toggle);

        this.nBtnClose = this.nFindSingle('close');
        this.nBtnClose.addEventListener('click', this.toggle);

        if (nFindComponent('btn-expand', this.nRoot)) {
            this.expandButtons = nFindComponents('btn-expand', this.nRoot).map((btn) => new BtnExpand(btn));
        }

        if (nFindComponent('input')) {
            this.inputs = nFindComponents('input', this.nRoot).map((input) => new Input(input));
        }

        if (nFindComponent('attach-file', this.nRoot)) {
            this.attachFiles = nFindComponents('attach-file', this.nRoot).map((file) => new AttachFile(file));
        } else {
            this.attachFiles = [];
        }

        if (nFindComponent('btn', this.nRoot)) {
            this.btns = nFindComponents('btn', this.nRoot).map((btn) => new Btn(btn, this.nRoot));
        }

        if (nFindComponent('contact-button', this.nRoot)) {
            this.contactButton = new ContactButton(nFindComponent('contact-button', this.nRoot));
        }

        if (nFindComponent('notification', this.nRoot)) {
            this.notification = new Notification(nFindComponent('notification', this.nRoot));
        }

        this.createNewInputs = this.createNewInputs.bind(this);
        listen('addedChild', this.createNewInputs);

        this.nInputsRequired = [];
        this.validateButton = this.validateButton.bind(this);
        this.inputs.forEach((input, i) => {
            input.nInput.addEventListener('input', this.validateButton);
            if (input.nInput.hasAttribute('required')) {
                this.nInputsRequired.push({ name: input.nInput.name, valid: false });
            }
        });
        this.attachFiles.forEach((attach) => {
            attach.nFile.addEventListener('change', this.validateButton);
        });

        this.sendQuestionnaire = this.sendQuestionnaire.bind(this);
        this.nForm = this.nFindSingle('form');
        this.nForm.addEventListener('submit', this.sendQuestionnaire);

        this.formSent = this.formSent.bind(this);
        if (document.querySelector('.contact-form_vacancy')) {
            listen('contact-form:successfully-sent', this.formSent, document.querySelector('.contact-form_vacancy'));
        }

        this.escClose = this.escClose.bind(this);
        document.addEventListener('keydown', this.escClose);
    }

    validateButton() {
        this.contactButton.enabled(this.checkValidateForm());
    }

    clearData() {
        this.inputs.forEach(input => input.clearValue());
        this.attachFiles.forEach(file => file.clearFiles());
    }

    checkValidateForm() {
        this.inputs.forEach((input, i) => {
            if (input.nInput.hasAttribute('required')) {
                this.nInputsRequired[i].valid = input.inputvalidate;
            }
        });
        const isAttachValid = this.attachFiles.every((attach) => {
            if (attach.nFile.hasAttribute('required')) {
                return attach.nFile.files.length !== 0;
            }
            return true;
        });

        const validInput = this.nInputsRequired.filter(input => input.valid === true);
        if (validInput.length === this.nInputsRequired.length && isAttachValid) {
            return true;
        }
    }

    collectData(data) {
        this.inputs.forEach((input) => {
            if (input.getValue() !== '') {
                data.append(`${input.getName()}`, `${input.getValue()}`);
            }
        });

        this.attachFiles.forEach((fileInput) => {
            const files = fileInput.getFiles();
            if (files[0]) {
                Array.from(files).forEach((file, i) => {
                    data.append(`${fileInput.getName()}[${i}]`, file);
                });
            }
        });

        [...this.nRoot.querySelectorAll('input[type="hidden"]')].forEach((input) => {
            if (input.value !== '') {
                data.append(`${input.getAttribute('name')}`, `${input.value}`);
            }
        });
    }

    async sendQuestionnaire(e) {
        e.preventDefault();
        this.contactButton.waiting();

        this.data = new FormData();
        this.collectData(this.data);
        const response = await axios.post(this.nForm.getAttribute('action'), this.data, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'text',
        })
            .then((response) => {
                this.serverAnswer(response);
            });

    }

    serverAnswer(response) {
        if (response.status === 200) {
            if (this.notification) this.notification.show();
            this.contactButton.updateState(true);
            setTimeout(() => {
                this.clearData();
                this.contactButton.enabled(false);
                this.toggle('popup-vacancy-questionnaire_show');
            }, 2000);
        } else {
            this.contactButton.updateState(false);
        }
    }

    formSent() {
        this.clearData();
        this.contactButton.enabled(false);
    }

    isOpened() {
        return this.nRoot.classList.contains('popup-vacancy-questionnaire_show');
    }

    toggle() {
        if (this.nRoot.classList.contains('popup-vacancy-questionnaire_show')) {
            this.nRoot.classList.remove('popup-vacancy-questionnaire_show');
            enableBodyScroll(this.nRoot);
        } else {
            this.nRoot.classList.add('popup-vacancy-questionnaire_show');
            disableBodyScroll(this.nRoot);
        }
    }

    escClose(e) {
        if (this.isOpened() && e.keyCode === 27) {
            this.toggle();
        }
    }

    createNewInputs(e) {
        this.inputs = this.inputs.concat([...e.detail.newNode.querySelectorAll('.input')].map((input) => {
            const el = new Input(input);
            el.nRoot.classList.remove('valid', 'invalid', 'focus');
            return el;
        }));
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

        if (nFindComponent('input')) {
            this.nInputs.forEach(item => item.destroy());
        }

        if (nFindComponent('attach-file')) {
            this.nAttachFiles.forEach(item => item.destroy());
        }

        unlisten('contact-form:successfully-sent', this.formSent);
    }
}

export default PopupVacancyQuestionnaire;
