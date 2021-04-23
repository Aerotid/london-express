export default class Component {
    constructor(nRoot, componentName) {
        this.nRoot = nRoot;
        this.componentName = componentName;
    }

    nFindSingle(key) {
        return this.nFind(key)[0];
    }

    nFind(key) {
        return [...this.nRoot.querySelectorAll(`.${this.componentName}__${key}`)];
    }

    nFindByDataAttrSingle(dataAttr) {
        return this.nFindByDataAttr(dataAttr)[0];
    }

    nFindByDataAttr(dataAttr) {
        return [...this.nRoot.querySelectorAll(`[data-${dataAttr}]`)];
    }

    switchToContrast() {
        this.nRoot.classList.add('contrast');
    }

    switchToNonContrast() {
        this.nRoot.classList.remove('contrast');
    }
}
