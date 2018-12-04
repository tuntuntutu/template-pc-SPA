import { message } from 'antd';

export const mapToArray = obj => Object.keys(obj).reduce((ret, key) => {
  ret.push({ value: obj[key], key });

  return ret;
}, []);

export const checkUploadImgParam = param => (file) => {
  const { FileReader, Image } = window;


  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const src = e.target.result;
      const image = new Image();

      image.onload = () => {
        const { width, height } = image;
        const { width: limitWidth, height: limitHeight, size: limitSize } = param;
        const isLtSize = file.size / 1024 < limitSize;

        if (width !== limitWidth || height !== limitHeight) {
          message.error(`照片分辨率必须要等于${limitWidth}*${limitHeight}`);
          reject();
        } else if (!isLtSize && limitSize) {
          message.error(`照片要小于${limitSize}kb`);
          reject();
        } else {
          resolve();
        }
      };
      image.src = src;
    };
    reader.readAsDataURL(file);
  });
};
