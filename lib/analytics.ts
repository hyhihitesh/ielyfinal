import mixpanel from "mixpanel-browser";

const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

    if (token) {
        const isDev = process.env.NODE_ENV === 'development';
        mixpanel.init(token, {
            debug: false, // Set to false to suppress "Bad HTTP status: 0" errors from AdBlockers
            track_pageview: true,
            persistence: "localStorage",
        });
    } else if (process.env.NODE_ENV === 'development') {
        console.warn('Mixpanel token not configured. Analytics disabled.');
    }
}

export default mixpanel;

