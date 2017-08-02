import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import 'konami-code-js';

import { Promise } from 'bluebird';

import { App } from './app';

Promise.config({
    cancellation: true
});

const app = Object.create(App);
app.init();
