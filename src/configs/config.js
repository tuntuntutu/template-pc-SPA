const preFix = process.env.NODE_ENV === 'development' ? 'http://10.0.10.41:8093' : '';

export const transformUrls = (obj = {}, projectPre = '') => Object.keys(obj).reduce((ret, key) => {
  ret[key] = { ...obj[key], url: `${preFix}${projectPre}${obj[key].url}` };

  return ret;
}, {});
