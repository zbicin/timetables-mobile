const path = require('path');
const svg = require('svgexport');
const iconOrange = 'icon-orange.svg';
const iconWhite = 'icon-white.svg';
const projectRoot = path.join(__dirname, '..');

const androidLabelSizeMap = {
    xxxhdpi: 192,
    xxhdpi: 144,
    xhdpi: 96,
    hdpi: 72,
    mdpi: 48,
    ldpi: 36
};

const androidIcon = (label) => [
    path.join(projectRoot, 'assets', iconOrange),
    path.join(projectRoot, 'www', 'res', 'icon', 'android', `drawable-${label}-icon.png`),
    `${androidLabelSizeMap[label]}:${androidLabelSizeMap[label]}`
];

const wp8LabelSizeMap = {
    ApplicationIcon: 99,
    Background: 159
};

const wp8Icon = (label) => [
    path.join(projectRoot, 'assets', iconOrange),
    path.join(projectRoot, 'www', 'res', 'icon', 'wp8', `${label}.png`),
    `${wp8LabelSizeMap[label]}:${wp8LabelSizeMap[label]}`
]

const args = [
    [
        path.join(projectRoot, 'assets', iconWhite),
        path.join(projectRoot, 'www', 'img', 'splash-icon.png'),
        '200:200'
    ],
    [
        path.join(projectRoot, 'assets', iconOrange),
        path.join(projectRoot, 'assets', 'icon512.png'),
        '512:512',
        '75%'
    ],
    [
        path.join(projectRoot, 'assets', 'chevron.svg'),
        path.join(projectRoot, 'www', 'img', 'chevron.png'),
        '128:128',
        '75%'
    ],
    ...Object.keys(wp8LabelSizeMap).map(wp8Icon),
    ...Object.keys(androidLabelSizeMap).map(androidIcon),
]

args.forEach((argSet) => svg.cli(argSet));