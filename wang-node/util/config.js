const https = require('https');
const qs = require('querystring');

        module.exports = {
    mp:{
        appId:'wx9dfc70f6ab141a1b',
        appSecret:'27f4529a714ba719d7ccac3a3dbfd113'
    },
    getToken(){
        const param = qs.stringify({
            'grant_type': 'client_credentials',
            'client_id': 'AItu8raHUfugBSk8tqoAPhxx',
            'client_secret': '74FlVjYQVkIUcsSEOaZQgFtkKRW4Aihz'
        });
    
        https.get(
            {
                hostname: 'aip.baidubce.com',
                path: '/oauth/2.0/token?' + param,
                agent: false
            },
            function (res) {
                // 在标准输出中查看运行结果
                res.pipe(process.stdout);
                return res.access_token;
            }
        );
    }
}