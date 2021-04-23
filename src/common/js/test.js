import '../css/common.css';
import '../scss/common.scss';
import 'objectFitPolyfill/dist/objectFitPolyfill.min';
import 'bootstrap/js/dist/collapse';
import 'babel-polyfill/dist/polyfill.min';
import './barbaInit';
import 'element-closest/browser';
import { isEdge, isIE, nGetBody, requireAll } from './helpers';
// import $ from 'jquery/dist/jquery.min';

if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

if (isIE() || isEdge()) {
    nGetBody().classList.add('is-ie');
}

/*requireAll(require.context('../../components/', true, /\.svg$/));
requireAll(require.context('../icons/', true, /\.svg$/));
requireAll(require.context('../../components/', true, /test.js$/));*/

window.addEventListener('resize', objectFitPolyfill);
