import Component from '../../common/js/component';
import {getDeviceType, listen, unlisten, Resize} from '../../common/js/helpers';
import Inputmask from 'inputmask/dist/min/inputmask/inputmask.min';
import datepicker from 'js-datepicker'

class Input extends Component {
    constructor(nRoot) {
        super(nRoot, 'input');
        this.currentDevice = getDeviceType();
        this.afterResize = this.afterResize.bind(this);

        this.nInput = this.nFindSingle('input');

        if (getDeviceType() === 'mobile') {
            this.initMobile();
        } else {
            this.initDesktop();
        }
        this.resize = new Resize(this);
        listen('deviceType:after-resize', this.afterResize, this.nRoot);

        // this.toggleClass = this.toggleClass.bind(this);

        if (this.nInput.getAttribute('type') === 'tel') {
            this.validatePhone = this.validatePhone.bind(this);
            this.nInput.addEventListener('input', this.validatePhone);
        }

        if (this.nInput.getAttribute('type') === 'text') {
            this.validateText = this.validateText.bind(this);
            this.nInput.addEventListener('input', this.validateText);
        }

        if (this.nInput.getAttribute('type') === 'email') {
            this.checkPattern = this.checkPattern.bind(this);
            this.nInput.addEventListener('input', this.checkPattern);
        }

        if (this.nInput.getAttribute('type') === 'date') {
            const picker = datepicker(this.nRoot);
            const lang = this.nInput.getAttribute('lang');
            this.dateMask = new Inputmask({
                mask: '99.99.9999',
                placeholder: lang === 'ru' ? 'дд.мм.гггг' : 'dd.mm.yyyy',
                showMaskOnHover: false,
            });
            this.dateMask.mask(this.nInput);

            this.validateDate = this.validateDate.bind(this);
            this.nInput.addEventListener('input', this.validateDate);
        }

        if (this.nInput.tagName === 'TEXTAREA') {
            this.validateTexarea = this.validateTexarea.bind(this);
            this.nInput.addEventListener('input', this.validateTexarea);
        }

        this.inputvalidate = false;

        this.focus = this.focus.bind(this);
        this.nInput.addEventListener('focus', this.focus);
        this.nInput.addEventListener('blur', this.focus);
    }

    focus() {
        if (this.nRoot.classList.contains('focus')) {
            this.nRoot.classList.remove('focus');
        } else {
            this.nRoot.classList.add('focus');
        }
    }

    getName() {
        return this.nInput.getAttribute('name');
    }

    getValue() {
        return this.nInput.value;
    }

    clearValue() {
        this.inputvalidate = false;
        this.nRoot.classList.remove('valid');
        this.nInput.value = '';
    }

    notValidateEmptyValue() {
        if (this.nInput.value === '' && !this.nInput.hasAttribute('required')) {
            this.inputvalidate = false;
            this.nRoot.classList.remove('valid', 'invalid');
        }
    }

    validatePhone() {
        this.inputvalidate = /(([+][(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))*[)]?[-\.]?[(]?[0-9]{1,3}[)]?([-\.]?[0-9]{3})([-\.]?[0-9]{3,4})/g.test(this.nInput.value.replace(/\s/g, ''));
        this.toggleClass(this.inputvalidate);
    }

    validateText() {
        // this.onlyText = this.nInput.value.replace(/[0-9]/g, '');
        // this.nInput.value = this.onlyText;
        if (this.nInput.value.length < 3) {
            this.inputvalidate = false;
        } else {
            this.inputvalidate = true;
        }
        this.toggleClass(this.inputvalidate);
        this.notValidateEmptyValue();
    }

    validateDate() {
        if (this.nInput.hasAttribute('data-has-picker')) {
            this.inputvalidate = this.nInput.value !== '';
        } else {
            this.inputvalidate = this.nInput.validity.valid;
        }
        this.toggleClass(this.inputvalidate);
        this.notValidateEmptyValue();
    }

    validateTexarea() {
        this.inputvalidate = true;
        this.toggleClass(this.inputvalidate);
        this.notValidateEmptyValue();
    }

    checkPattern() {
        const regex = /[a-zA-Z0-9_]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/;
        if (regex.test(this.nInput.value)) {
            this.inputvalidate = true;
        } else {
            this.inputvalidate = false;
        }
        this.toggleClass(this.inputvalidate);
        this.notValidateEmptyValue();
    }

    toggleClass(validate) {
        if (validate) {
            this.nRoot.classList.remove('invalid');
            this.nRoot.classList.add('valid');
        } else {
            this.nRoot.classList.remove('valid');
            this.nRoot.classList.add('invalid');
        }
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

    destroy() {
        unlisten('deviceType:after-resize', this.afterResize);
        if (getDeviceType() === 'mobile') {
            this.destroyMobile();
        } else {
            this.destroyDesktop();
        }
    }
}

export default Input;
