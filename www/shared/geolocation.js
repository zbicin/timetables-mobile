const getCurrentPosition = () => new Promise((resolve, reject) => {
    const timeout = 10000;
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout });
});

const Geolocation = {
    getCurrentPosition
};