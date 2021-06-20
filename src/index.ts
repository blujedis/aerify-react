import * as hooks from './hooks';
import * as notify from './notify';
import * as portal from './portal';
import * as tabs from './tabs';
import * as table from './table';

export {
  hooks,
  notify,
  portal,
  tabs,
  table
};

// NOTE: for tree shaking best practice 
// is typically to import using path from
// above export.
export default { hooks, notify, portal, tabs, table };