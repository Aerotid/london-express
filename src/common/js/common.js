import '../css/common.css';
import '../scss/common.scss';
import 'picturefill/dist/picturefill.min';
import 'objectFitPolyfill/dist/objectFitPolyfill.min';
import 'babel-polyfill/dist/polyfill.min';
import './barbaInit';
import 'element-closest/browser';
import { isEdge, isIE, nGetBody } from './helpers';
// import $ from 'jquery/dist/jquery.min';

if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
}

function requireAll(r) {
    r.keys().forEach(r);
}

if (isIE() || isEdge()) {
    nGetBody().classList.add('is-ie');
}

//requireAll(require.context('../../components/', true, /\.svg$/));
//requireAll(require.context('../icons/', true, /\.svg$/));

window.addEventListener('resize', () => {
    objectFitPolyfill();
});

