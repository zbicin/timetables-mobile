const METHODS = {
    GET: 'GET',
    POST: 'POST',
    HEAD: 'HEAD'
};

const doRequest = (url, method = METHODS.GET, headers = {}, data = null) => new Promise((resolve, reject) => {
    const isAsync = true;
    const isLocalBrowser = location.protocol.indexOf('http') > -1;
    const localProxyAddress = 'http://localhost:1337/';
    const request = new XMLHttpRequest();
    request.withCredentials = true;

    if(isLocalBrowser) {
        url = url.replace('https://', '').replace('http://', '');
        url = localProxyAddress + url;
    }

    request.onreadystatechange = (event) => {
        const isSuccessful = request.readyState === XMLHttpRequest.DONE;
        if (isSuccessful) {
            const isHttpOk = request.status === 200;
            if (isHttpOk) {
                resolve(request);
            }
            else {
                reject(request);
            }
        }
    };

    request.open(method, url, isAsync);
    request.send(data);
});


export const Http = {
    get: (url, headers) => doRequest(url, METHODS.GET, headers, null),
    head: (url, headers) => doRequest(url, METHODS.HEAD, headers, null),
    post: (url, headers, data) => doRequest(url, METHODS.POST, headers, data)
};