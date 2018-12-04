import { transformUrls } from './config';

export const globalUrls = transformUrls({
  fetchCategory: {
    url: '',
    method: 'post',
  },
}, '/common');
