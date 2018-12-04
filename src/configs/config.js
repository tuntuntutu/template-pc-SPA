
const preFix = process.env.NODE_ENV === 'development' ? 'http://10.0.10.41:8093' : '';

export const transformUrls = (obj = {}, projectPre = '') => Object.keys(obj).reduce((ret, key) => {
  ret[key] = { ...obj[key], url: `${preFix}${projectPre}${obj[key].url}` };

  return ret;
}, {});

// 通用图片上传配置信息
export const commonPicUploadConfig = {
  name: 'picture',
  action: `${preFix}/common/uploadImg`,
  accept: 'image/*',
  listType: 'picture-card',
};

// 富文本图片上传接口配置信息
export const editorUploadImgConfig = {
  url: `${preFix}/common/uploadImg`,
  method: 'post',
  dataType: 'formData',
};
