import axios from 'axios';
export const pingSearchEngines = async (targetUrl) => {
    const engines = [
        { name: 'Google Sitemap', url: `https://www.google.com/ping?sitemap=${targetUrl}` },
        { name: 'Bing Sitemap', url: `https://www.bing.com/ping?sitemap=${targetUrl}` },
        { name: 'Google News', url: `https://www.google.com/webmasters/sitemaps/ping?sitemap=${targetUrl}` },
        { name: 'Yandex', url: `http://blogs.yandex.ru/pings/?status=success&url=${targetUrl}` },
    ];
    // Common RPC-XML ping endpoints (Standard for Blog/SEO tools)
    const rpcEndpoints = [
        'http://rpc.pingomatic.com/',
        'http://rpc.twingly.com/',
        'http://api.feedster.com/ping',
        'http://api.moreover.com/ping',
        'http://www.blogdigger.com/RPC2',
        'http://www.blogstreet.com/xrbin/xmlrpc.cgi',
        'http://bulkfeeds.net/rpc',
    ];
    const results = await Promise.allSettled([
        ...engines.map(async (engine) => {
            try {
                await axios.get(engine.url, { timeout: 5000 });
                return { name: engine.name, type: 'GET', status: 'success' };
            }
            catch (error) {
                return { name: engine.name, type: 'GET', status: 'failed' };
            }
        }),
        ...rpcEndpoints.map(async (endpoint) => {
            try {
                // Basic XML-RPC ping payload
                const xmlPayload = `
          <?xml version="1.0"?>
          <methodCall>
            <methodName>weblogUpdates.ping</methodName>
            <params>
              <param><value>Indexer Signal</value></param>
              <param><value>${targetUrl}</value></param>
            </params>
          </methodCall>
        `;
                await axios.post(endpoint, xmlPayload, {
                    headers: { 'Content-Type': 'text/xml' },
                    timeout: 5000
                });
                return { name: endpoint, type: 'RPC', status: 'success' };
            }
            catch (error) {
                return { name: endpoint, type: 'RPC', status: 'failed' };
            }
        })
    ]);
    return results;
};
//# sourceMappingURL=pingService.js.map