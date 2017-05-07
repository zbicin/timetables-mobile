const path = require('path');
const svg = require('svgexport');
const iconOrange = 'icon-orange.svg';
const iconWhite = 'icon-white.svg';

const androidLabelSizeMap = {
    xxxhdpi: 192,
    xxhdpi: 144,
    xhdpi: 96,
    hdpi: 72,
    mdpi: 48,
    ldpi: 36
};

const androidIcon = (label) => [
    iconOrange,
    path.join('www', 'res', 'icon', 'android', `drawable-${label}-icon.png`),
    `${androidLabelSizeMap[label]}:${androidLabelSizeMap[label]}`
];

const wp8LabelSizeMap = {
    ApplicationIcon: 99,
    Background: 159
};

const wp8Icon = (label) => [
    iconOrange,
    path.join('www', 'res', 'icon', 'wp8', `${label}.png`),
    `${wp8LabelSizeMap[label]}:${wp8LabelSizeMap[label]}`
]

const args = [
    [
        iconWhite,
        path.join('www', 'img', 'splash-icon.png'),
        '200:200'
    ],
    ...Object.keys(wp8LabelSizeMap).map(wp8Icon),
    ...Object.keys(androidLabelSizeMap).map(androidIcon),
]

args.forEach((argSet) => svg.cli(argSet));