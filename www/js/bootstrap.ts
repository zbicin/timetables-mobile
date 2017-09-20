import '../css/reset.css';
import '../css/style.css'

import 'core-js';
import 'js-polyfills/polyfill';
import 'konami-code-js/lib/konami-code.min.js';
import './services/domParser.polyfill';
import 'promise-polyfill/promise.js';

import { App } from './app';
import { Timetables } from './services/timetables';
import { UI } from './ui/ui';

if(!(window as any).Promise) {
    (window as any).Promise = Promise;
}
const app = new App(Timetables, UI); 
