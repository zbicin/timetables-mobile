import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import 'js-polyfills/polyfill';
import 'konami-code-js/lib/konami-code.min.js';
import './services/domParser.polyfill';

import { Promise } from 'bluebird';

import { App } from './app';
import { Timetables } from './services/timetables';
import { UI } from './ui/ui';

Promise.config({
    cancellation: true
});

const app = new App(Timetables, UI);
