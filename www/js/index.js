import reset from '../css/reset.css';
import style from '../css/style.css'

import 'core-js';
import 'konami-code-js';

import { Promise } from 'bluebird';

import { App } from './app';
import { Timetables } from './services/timetables';
import { UI } from './ui/ui';

Promise.config({
    cancellation: true
});

const app = new App(Timetables, UI);
