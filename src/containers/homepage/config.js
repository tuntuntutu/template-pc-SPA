import { transformUrls } from '@/configs/config';


export const urls = transformUrls({
  fetchList: {
    url: '/material/query',
    method: 'get',
  },
  fetchDetail: {
    url: '/material/detail',
    method: 'get',
  },
  apply: {
    url: '/supplierStock/querySupplierStockPage',
    method: 'post',
  },
  logs: {
    url: '/common/queryOperateLogs',
    method: 'post',
  },
  fetchBizlLines: {
    url: '/common/bizline',
    method: 'get',
  },
  fetchTerminals: {
    url: '/common/terminal',
    method: 'get',
  },
  fetchAds: {
    url: '/position/list',
    method: 'get',
  },
  add: {
    url: '/material/add',
    method: 'post',
  },
  update: {
    url: '/material/edit',
    method: 'post',
  },
  audit: {
    url: '/audit/checkAdvertAudit',
    method: 'post',
  },
  fetchLandingPageTypeList: {
    url: '/common/innerAppPages',
    method: 'get',
  },
  fetchPicPrefix: {
    url: '/fileUpload/aliyundomain',
    method: 'get',
  },
}, '/advert-boss');

export const pages = {
  create: '/marketing-ads-center/originality-manager/create',
  list: '/marketing-ads-center/originality-manager/index',
};

export const renders = {};

export const applyStatusList = [
  { key: 0, value: '待审核' },
  { key: 1, value: '审核中' },
  { key: 2, value: '审核通过' }, {
    key: 3,
    value: '驳回',
  }];

