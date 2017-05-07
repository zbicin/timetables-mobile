const getCurrentPosition = () => new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
});

const Geolocation = {
    getCurrentPosition
};