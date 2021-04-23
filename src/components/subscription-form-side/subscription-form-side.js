import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents, emit } from '../../common/js/helpers';
import Input from '../input/input';
import ContactButton from '../contact-button/contact-button';
import axios from 'axios/dist/axios.min';
import Notification from "../notification/notification";

class SubscriptionFormSide extends Component {
    constructor(nRoot) {
        super(nRoot, 'subscription-form-side');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this)

        this.nInputsRequired = [];
        this.validateButton = this.validateButton.bind(this);
        this.collapseExpand = this.collapseExpand.bind(this);

        this.nClose = this.nFindSingle('close');

        this.errorsText = this.nFindSingle('errors');
        this.emailError = this.nFindSingle('error_email');
        this.phoneError = this.nFindSingle('error_phone');

        if (nFindComponent('input'), this.nRoot) {
            this.nInputs = nFindComponents('input', this.nRoot).map(input => new Input(input));
            this.nInputs.forEach((input, i) => {
                input.nInput.addEventListener('input', this.validateButton);
                if (input.nInput.hasAttribute('required')) {
                    this.nInputsRequired.push({ name: input.nInput.name, valid: false });
                }
            });
        }

        if (nFindComponent('contact-button', this.nRoot)) {
            this.contactsButton = new ContactButton(nFindComponent('contact-button', this.nRoot));
        }

        if (nFindComponent('notification', this.nRoot)) {
            this.notification = new Notification(nFindComponent('notification', this.nRoot));
        }

        this.sendForm = this.sendForm.bind(this);
        this.form = this.nFindSingle('form');
        if (this.form) {
            this.form.addEventListener('submit', this.sendForm);
            this.form.addEventListener('click', function(e) {e.stopPropagation();});
        }

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);
    }

    clearData() {
        this.nInputs.forEach(input => input.clearValue());
    }

    validateButton() {
        this.contactsButton.enabled(this.checkValidateForm());
    }

    checkValidateForm() {
        this.showErrors(false);
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

    collectData(form) {
        this.nInputs.forEach((input) => {
            const inputName = input.getName();
            const inputValue = input.getValue();
            form.append(`${inputName}`, `${inputValue}`);
        });

        [...this.nRoot.querySelectorAll('input[type="hidden"]')].forEach((input) => {
            const hidName = input.getAttribute('name');
            const hidValue = input.value;
            form.append(`${hidName}`, `${hidValue}`);
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
        if (response.data.status === 'success') {
            if (this.notification) this.notification.show();
            this.contactsButton.updateState(true);
            setTimeout(() => {
                this.clearData();
                this.contactsButton.enabled(false);
                this.nRoot.classList.add('collapsed');
                if (this.notification) this.notification.hide();
                window.location = `https://lk.londonexpress-online.com/?api_token=${response.data.api_token}`;
            }, 2000);
        } else {
            // this.updateErrors({ email: ['email error'], phone: ['phone error']});
            if(response.data && response.data.errors) {
                this.updateErrors(response.data.errors)
            }
            this.contactsButton.updateState(false);
        }
    }

    collapseExpand() {
        if (this.nRoot.classList.contains('collapsed')) {
            emit('subscription-form-side:expanded', null, false, this.nRoot);
            this.nRoot.classList.remove('collapsed');
        } else {
            emit('subscription-form-side:collapsed', null, false, this.nRoot);
            this.nRoot.classList.add('collapsed');
        }
    }

    initDesktop() {
        this.nRoot.addEventListener('click', this.collapseExpand);
    }

    initMobile() {
        this.nRoot.addEventListener('click', this.collapseExpand);
        //this.nClose.addEventListener('click', this.collapseExpand);
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
        this.nRoot.removeEventListener('click', this.collapseExpand);
    }

    destroyMobile() {
        //this.nClose.removeEventListener('click', this.collapseExpand);
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

export default SubscriptionFormSide;
