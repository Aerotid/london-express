import axios from 'axios/dist/axios.min';
import Component from '../../common/js/component';
import { isFunction, arrNodesFromHTML } from '../../common/js/helpers';
import { listen, emit } from '../../common/js/helpers';

class EndlessBtn extends Component {
    get getCurrentPage() {
        return this.nEndlessBtn.getAttribute('data-count-page');
    }

    constructor(
        nRoot,
        initializFunciton,
        nAppendContainer = document.querySelector('.endless-btn__container'),
    ) {
        super(nRoot, 'endless-btn');

        this.utlPath = location.pathname;
        this.nAppendContainer = nAppendContainer;
        this.initializFunciton = initializFunciton;
        // this.nFiltersSelects = [...document.querySelectorAll('.select__select')];
        this.nEndlessBtn = this.nRoot;
        this.CurrentPage = 1;

        this.pageName = 'PAGEN_1';

        this.getNewData = this.getNewData.bind(this);
        this.nEndlessBtn.addEventListener('click', this.getNewData);
    }

    getNewData() {
        // if(this.nFiltersSelects.length !== 0) {
        //   this.getFiltersSelectValue(dataForm);
        // }
        this.CurrentPage = +this.getCurrentPage + 1;
        axios.get(`${this.utlPath}\?${this.pageName}=${this.CurrentPage}`, {
            // axios.get('/dataFilters.json', dataForm, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'multipart/form-data',
            },
            responseType: 'text',
        }).then((response) => {
            const dataResponse = response.data;
            this.responseReaction(dataResponse);
        }).catch((response) => {
            console.log(response);
        });
    }

    responseReaction(dataResponse) {
        // this.nAppendContainer.innerHTML += dataResponse.data;
        const newNodsArr = arrNodesFromHTML(dataResponse.html);
        newNodsArr.forEach((newNod) => {
            this.nAppendContainer.appendChild(newNod);
        });
        emit('endless-btn:nodes-added', { newNodsArr }, false, this.nRoot);

        if (isFunction(this.initializFunciton)) {
            this.initializFunciton(newNodsArr);
        }

        this.nEndlessBtn.setAttribute('data-count-page', this.CurrentPage);

        if (dataResponse.isLastPage === 'Y') {
            emit('endless-btn:last-page', null, false, this.nRoot);
            this.nRoot.classList.add('endless-btn_is-hidden');
        }
    }


    getFiltersSelectValue(dataForm) {
        this.nFiltersSelects.forEach((nSelect) => {
            dataForm.append(nSelect.getAttribute('name'), nSelect.value);
        });
    }

    destroy() {
        this.nEndlessBtn.removeEventListener('click', this.getNewData);
    }
}

export default EndlessBtn;
