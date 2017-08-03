import { Promise } from 'bluebird';

const localProxyAddress = 'http://localhost:1337/';

const Methods = {
    Get: 'GET',
    Head: 'HEAD',
    Post: 'POST'
};

export class Http {
    constructor() {
        this.isLocalBrowser = location.protocol.indexOf('http') > -1;
    }

    get(url, headers) {
        return this._doRequest(url, Methods.Get, headers, null);
    }
    head(url, headers) {
        return this._doRequest(url, Methods.Head, headers, null);
    }
    post(url, headers, data) {
        return this._doRequest(url, Methods.Post, headers, data);
    }

    _doRequest(url, method = Methods.Get, headers = {}, data = null) {
        return new Promise((resolve, reject) => {
            const isAsync = true;
            const request = new XMLHttpRequest();
            request.withCredentials = true;

            if (this.isLocalBrowser) {
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
            Object.keys(headers).forEach((key) => request.setRequestHeader(key, headers[key]));
            request.send(data);
        });
    };
};