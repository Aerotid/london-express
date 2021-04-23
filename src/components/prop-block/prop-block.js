import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize, nFindComponents } from '../../common/js/helpers';
import Input from '../input/input';
import Notification from '../notification/notification';
import axios from 'axios/dist/axios.min';
import ContactButton from '../contact-button/contact-button';

class PropBlock extends Component {
    constructor(nRoot) {
        super(nRoot, 'prop-block');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        if (this.nFindSingle('form')) {
            if (nFindComponent('input')) {
                this.inputs = nFindComponents('input', this.nRoot).map(input => new Input(input));
            }

            this.nInputsContainer = this.nFindSingle('inputs');
            this.nBlockContainer = this.nFindSingle('container');

            if (nFindComponent('contact-button')) {
                this.contactsButton = new ContactButton(nFindComponent('contact-button'), this.nRoot);
            }
            this.contactsButton.enabled(true);
            this.onClick = this.onClick.bind(this);
            this.contactsButton.nRoot.addEventListener('click', this.onClick);

            this.sendForm = this.sendForm.bind(this);
            this.nForm = this.nFindSingle('form');
            this.nBottomInfo = this.nForm.querySelector('.prop-block__bottom-info');
            this.nForm.addEventListener('submit', this.sendForm);

            this.errorsText = this.nFindSingle('errors');
            this.emailError = this.nFindSingle('error_email');
            this.phoneError = this.nFindSingle('error_phone');

            this.nInputsRequired = [];
            this.validateButton = this.validateButton.bind(this);
            this.inputs.forEach((input, i) => {
                input.nInput.addEventListener('input', this.validateButton);
                if (input.nInput.hasAttribute('required')) {
                    this.nInputsRequired.push({ name: input.nInput.name, valid: false });
                }
            });

            if (nFindComponent('notification', this.nRoot)) {
                this.notification = new Notification(nFindComponent('notification', this.nRoot));
            }

            this.nDescription = this.nFindSingle('description');
            this.nSubdescription = this.nFindSingle('subdescription');
            this.nSubtitle = this.nFindSingle('subtitle');

            TweenLite.set(this.nInputsContainer, { height: '0', opacity: '0' });
            TweenLite.set(this.nBottomInfo, { height: '0', opacity: '0' });
        }
    }

    onClick() {
        if (!this.nRoot.classList.contains('expanded')) {
            this.nRoot.classList.add('expanded');
            const tl = new TimelineLite();
            if (getDeviceType() === 'desktop') {
                tl.staggerTo([this.nDescription, this.nSubdescription, this.nSubtitle, this.contactsButton.nRoot], 0.4, { opacity: 0 })
                    .set([this.nDescription, this.nSubdescription, this.nSubtitle], { display: 'none' })
                    .set(this.nInputsContainer, { marginBottom: '6rem' })
                    .set(this.nBlockContainer, { height: this.nBlockContainer.offsetHeight })
                    .set(this.nBottomInfo, { height: 'auto' })
                    .set(this.nInputsContainer, { height: 'auto' })
                    .staggerTo([this.nInputsContainer, this.contactsButton.nRoot, this.nBottomInfo], 0.4, { opacity: 1 });
            } else {
                TweenLite.set(this.nBottomInfo, { height: 'auto' });
                TweenLite.set(this.nInputsContainer, { height: 'auto' });
                tl.from(this.nInputsContainer, 0.2, { height: 0 }, '0.2')
                    .to(this.nInputsContainer, 0.2, { marginBottom: '3rem', opacity: 1 }, '0.2')
                    .from(this.nBottomInfo, 0.2, { height: 0 })
                    .to(this.nBottomInfo, 0.2, { marginBottom: '3rem', opacity: 1 });
            }
            this.contactsButton.enabled(false);
        }
    }

    clearData() {
        this.inputs.forEach(input => input.clearValue());
    }

    validateButton() {
        this.showErrors(false);
        this.contactsButton.enabled(this.checkValidateForm());
    }

    checkValidateForm() {
        this.inputs.forEach((input, i) => {
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
        this.inputs.forEach((input) => {
            const inputName = input.getName();
            const inputValue = input.getValue();
            contactForm.append(`${inputName}`, `${inputValue}`);
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
        if (this.nRoot.classList.contains('expanded')) {
            this.dataForm = new FormData();
            this.collectData(this.dataForm);
            this.contactsButton.waiting();

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
    }

    serverAnswer(response) {
        if (response.data.status === 'success') {
            if (this.notification) this.notification.show();
            this.contactsButton.updateState(true);
            setTimeout(() => {
                this.clearData();
                this.contactsButton.enabled(false);
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
        this.nBlockContainer.style.height = 'auto';
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
            this.inputs.forEach(item => item.destroy());
        }
        this.inputs.forEach(input => input.nRoot.querySelector('.input__input').removeEventListener('input', this.validateButton));
    }
}

export default PropBlock;
