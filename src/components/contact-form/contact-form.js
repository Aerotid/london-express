import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents, emit } from '../../common/js/helpers';
import Input from '../input/input';
import AttachFile from '../attach-file/attach-file';
import ContactButton from '../contact-button/contact-button';
import Notification from '../notification/notification';
import axios from 'axios/dist/axios.min';

class ContactForm extends Component {
    constructor(nRoot, signsUpLk = false) {
        super(nRoot, 'contact-form');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        this.signsUpLK = signsUpLk;

        if (nFindComponent('input')) {
            this.nInputs = nFindComponents('input', this.nRoot).map(input => new Input(input));
        }

        if (nFindComponent('attach-file', this.nRoot)) {
            this.nAttachFile = nFindComponents('attach-file', this.nRoot).map(file => new AttachFile(file));
        } else {
            this.nAttachFile = [];
        }

        if (nFindComponent('contact-button', this.nRoot)) {
            this.contactsButton = new ContactButton(nFindComponent('contact-button', this.nRoot));
        }

        this.showQuestionnaire = this.showQuestionnaire.bind(this);
        if (this.nFindSingle('questionnaire-button', this.nRoot)) {
            this.nPopupButton = this.nFindSingle('questionnaire-button', this.nRoot);
            this.nPopupButton.addEventListener('click', this.showQuestionnaire);
        }

        this.sendForm = this.sendForm.bind(this);

        if (this.nFindSingle('form')) {
            this.nForm = this.nFindSingle('form');
            this.nForm.addEventListener('submit', this.sendForm);
        }

        this.nInputsRequired = [];

        this.validateButton = this.validateButton.bind(this);
        this.nInputs.forEach((input, i) => {
            input.nInput.addEventListener('input', this.validateButton);
            if (input.nInput.hasAttribute('required')) {
                this.nInputsRequired.push({ name: input.nInput.name, valid: false });
            }
        });

        if (nFindComponent('notification', this.nRoot)) {
            this.notification = new Notification(nFindComponent('notification', this.nRoot));
        }

        this.errorsText = this.nFindSingle('errors');
        this.emailError = this.nFindSingle('error_email');
        this.phoneError = this.nFindSingle('error_phone');
    }

    initDesktop() {

    }

    initMobile() {

    }

    afterResize() {
        if (getDeviceType() !== this.currentDevice) {
            if (getDeviceType() === 'desktop') {
                this.destroyDesktop();
                this.initMobile();
            } else if (this.currentDevice === 'desktop') {
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

    showQuestionnaire() {
        emit('popupQuestionnaire:show');
    }

    clearData() {
        this.nInputs.forEach(input => input.clearValue());
        this.nAttachFile.forEach(file => file.clearFiles());
    }

    validateButton() {
        this.showErrors(false);
        this.contactsButton.enabled(this.checkValidateForm());
    }

    checkValidateForm() {
        this.nInputs.forEach((input, i) => {
            if (input.nInput.hasAttribute('required')) {
                this.nInputsRequired[i].valid = input.inputvalidate;
            }
        });
        const validInput = this.nInputsRequired.filter(input => input.valid === true);

        if (validInput.length === this.nInputsRequired.length) {
            return true;
        }
    }

    collectData(contactForm) {
        this.nInputs.forEach((input) => {
            const inputName = input.getName();
            const inputValue = input.getValue();
            contactForm.append(`${inputName}`, `${inputValue}`);
        });

        this.nAttachFile.forEach((fileInput) => {
            const files = fileInput.getFiles();
            if (files[0]) {
                Array.from(files).forEach((file, i) => {
                    contactForm.append(`${fileInput.getName()}[${i}]`, file);
                });
            }
        });

        [...this.nRoot.querySelectorAll('input[type="hidden"]')].forEach((input) => {
            const hidName = input.getAttribute('name');
            const hidValue = input.value;
            contactForm.append(`${hidName}`, `${hidValue}`);
        });
    }

    showErrors(status = true) {
        if (status) this.errorsText.classList.add('show');
        else this.errorsText.classList.remove('show');
    }

    updateErrors(errors) {
        this.emailError.innerHTML = '';
        this.phoneError.innerHTML = '';
        this.showErrors();
        if (errors.email && errors.email.length > 0) {
            this.emailError.innerHTML = errors.email[0];
        }
        if (errors.phone && errors.phone.length > 0) {
            this.phoneError.innerHTML = errors.phone[0];
        }
    }

    async sendForm(e) {
        e.preventDefault();
        this.showErrors(false);
        this.contactsButton.waiting();

        this.dataForm = new FormData();
        this.collectData(this.dataForm);

        const response = await axios.post(this.nFindSingle('form').getAttribute('action'), this.dataForm, {
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
        if (response.data.status === 'success' || response.data.status === 'ok') {
            if (this.notification) this.notification.show();
            this.contactsButton.updateState(true);
            setTimeout(() => {
                emit('contact-form:successfully-sent', response.data, false, this.nRoot);
                this.clearData();
                this.contactsButton.enabled(false);
                if (this.notification) this.notification.hide();
                if (this.signsUpLK) {
                    window.location = `https://lk.londonexpress-online.com/?api_token=${response.data.api_token}`;
                }
            }, 2000);
        } else {
            // this.updateErrors({ email: ['email error'], phone: ['phone error']});
            if(response.data && response.data.errors) {
                this.updateErrors(response.data.errors)
            }
            emit('contact-form:error', response, false, this.nRoot);
            this.contactsButton.updateState(false);
        }
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
            this.nAttachFile.forEach(item => item.destroy());
        }

        this.nInputs.forEach(input => input.nRoot.querySelector('.input__input').removeEventListener('input', this.validateButton));
    }
}

export default ContactForm;
