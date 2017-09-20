declare module 'google-maps' {
    export default class GoogleMapsLoader {
        static load(callback: (google: any) => void);
        static onLoad(callback: (google: any) => void);
        static release(callback: () => void);

        static CLIENT: string;
        static KEY: string;
        static LIBRARIES: string[];
        static LANGUAGE: string;
        static REGION: string;
        static VERSION: string;
    }

}
