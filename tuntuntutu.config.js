module.exports = {
  name: '',
  platform: 'pc',
  type: 'spa',
  proxy: {
    '/api-proxy/*': { // 项目名称
      target: 'https://nei.netease.com/api/apimock/b18b9194706ed7b44a85a966c8546d46', // b18b9194706ed7b44a85a966c8546d46的为 nei平台 项目KEY
      pathRewrite: { '^/api-proxy': '' },
      secure: false,
      changeOrigin: true,
    },
  },
};

