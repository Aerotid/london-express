import Component from '../../common/js/component';
import { getDeviceType, listen, unlisten, nFindComponent, Resize } from '../../common/js/helpers';
import axios from 'axios/dist/axios.min';
import ContactButton from "../contact-button/contact-button";
import Input from "../input/input";
import Notification from "../notification/notification";

class SubscriptionFreeCourse extends Component {
    constructor(nRoot) {
        super(nRoot, 'subscription-free-course');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize);

        if (nFindComponent('contact-button', this.nRoot)) {
            this.contactsButton = new ContactButton(nFindComponent('contact-button', this.nRoot));
        }

        if (nFindComponent('input', this.nRoot)) {
            this.email = new Input(nFindComponent('input', this.nRoot));
        }

        if (nFindComponent('notification', this.nRoot)) {
            this.notification = new Notification(nFindComponent('notification', this.nRoot));
        }

        this.onSubmit = this.onSubmit.bind(this);
        this.nFindSingle('form').addEventListener('submit', this.onSubmit);

        this.onInputChange = this.onInputChange.bind(this);
        this.email.nInput.addEventListener('input', this.onInputChange);
    }

    onInputChange() {
        this.contactsButton.enabled(this.email.inputvalidate);

        if (getDeviceType() !== 'mobile') {
            if (this.email.inputvalidate) {
                this.contactsButton.nRoot.classList.add('valid');
                this.contactsButton.nRoot.classList.remove('invalid');
            } else {
                this.contactsButton.nRoot.classList.add('invalid');
                this.contactsButton.nRoot.classList.remove('valid');
            }
        }
    }

    async onSubmit(e) {
        e.preventDefault();
        this.contactsButton.waiting();
        const dataForm = new FormData();
        dataForm.append(this.email.nInput.name, this.email.nInput.value);

        [...this.nRoot.querySelectorAll('input[type="hidden"')].forEach((input) => {
            const hidName = input.getAttribute('name');
            const hidValue = input.value;
            dataForm.append(`${hidName}`, `${hidValue}`);
        });

        const request = await axios.post(this.nFindSingle('form').getAttribute('action'), dataForm, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'text',
        }).then((response) => {
            response.status === 200 ? this.onSuccess() : this.onFail();
        });
    }

    onSuccess() {
        if (this.notification) this.notification.show();
        this.contactsButton.updateState(true);
        setTimeout(() => {
            this.email.clearValue();
            this.contactsButton.enabled(false);
            this.contactsButton.nRoot.classList.remove('valid');
        }, 2000);
    }

    onFail() {
        this.contactsButton.updateState(false);
        this.contactsButton.nRoot.classList.remove('valid');
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

export default SubscriptionFreeCourse;
