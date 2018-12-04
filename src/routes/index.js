import Index from '@/containers/index';
import Home from '@/containers/homepage/route';

export default {
  path: '',
  component: Index,
  childRoutes: [
    Home,
  ],
};
