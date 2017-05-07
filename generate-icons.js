const path = require('path');
const svg = require('svgexport');
const iconOrange = 'icon-orange.svg';
const iconWhite = 'icon-white.svg';

const labelSizeMap = {
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
    `${labelSizeMap[label]}:${labelSizeMap[label]}`
];

const args = [
    [
        iconWhite,
        path.join('www', 'img', 'splash-icon.png'),
        '200:200'
    ],
    ...Object.keys(labelSizeMap).map(androidIcon)
]

args.forEach((argSet) => svg.cli(argSet));