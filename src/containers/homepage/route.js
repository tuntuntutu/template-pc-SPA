import Entry from './entry/index';
import Create from './create/index';


export default {
  path: 'homepage',
  indexRoute: { component: Entry },
  childRoutes: [
    {
      path: 'create',
      component: Create,
    },
    {
      path: 'index',
      component: Entry,
    },
  ],
};
