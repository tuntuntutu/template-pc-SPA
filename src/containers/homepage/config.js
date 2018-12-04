import { transformUrls } from '@/configs/config';


export const urls = transformUrls({
  fetchList: {
    url: '/material/query',
    method: 'get',
  },
}, '/advert-boss');

export const pages = {
  create: '/homepage/create',
  list: '/homepage/index',
};

export const renders = {};
