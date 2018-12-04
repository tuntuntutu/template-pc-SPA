import { transformUrls } from './config';

export const globalUrls = transformUrls({
  uploadImg: {
    url: '/uploadImg',
    method: 'post',
  },
  imgOfUEditor: {
    url: '/uploadImg',
    method: 'post',
  },
}, '/common');

// 通用图片上传配置信息
export const commonPicUploadConfig = {
  name: 'picture',
  action: globalUrls.uploadImg.url,
  accept: 'image/*',
  listType: 'picture-card',
};

// 富文本图片上传接口配置信息
export const editorUploadImgConfig = {
  url: globalUrls.imgOfUEditor.url,
  method: 'post',
  dataType: 'formData',
};
