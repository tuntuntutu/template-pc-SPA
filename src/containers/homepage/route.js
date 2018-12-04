import Entry from './entry/index';
import Create from './create/index';


export default {
  path: 'originality-manager',
  indexRoute: { component: Entry },
  childRoutes: [
    {
      path: 'create',
      component: Create,
    },
    {
      path: 'Index',
      component: Entry,
    },
  ],
};
