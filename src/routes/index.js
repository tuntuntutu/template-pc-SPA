import Index from '@/containers/index';
import Home from '@/containers/home/route';

export default {
  path: '/',
  component: Index,
  childRoute: [
    Home,
  ],
};
