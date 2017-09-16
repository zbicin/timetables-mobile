const localProxyAddress = 'http://localhost:1337/';

enum Methods {
    Get = 'GET',
    Head = 'HEAD',
    Post = 'POST'
};

export class Http {
    private isLocalBrowser: boolean;

    constructor() {
        this.isLocalBrowser = location.protocol.indexOf('http') > -1;
    }

    public get(url: string, headers?: object): Promise<XMLHttpRequest> {
        return this.doRequest(url, Methods.Get, headers, null);
    }
    public head(url: string, headers?: object): Promise<XMLHttpRequest> {
        return this.doRequest(url, Methods.Head, headers, null);
    }
    public post(url: string, headers?: object, data?: object): Promise<XMLHttpRequest> {
        return this.doRequest(url, Methods.Post, headers, data);
    }

    private doRequest(url: string, method: Methods = Methods.Get, headers = {}, data = null): Promise<XMLHttpRequest> {
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