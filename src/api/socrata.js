import Socrata from 'node-socrata';

import {
  bindCallback
} from 'rxjs';

const config = {
  hostDomain: 'https://data.lacity.org',
  resource: '7qi3-mqr5',
  XAppToken: process.env.VUE_APP_SOCRATA_KEY,
};

const soda = new Socrata(config);

export default soda;

const getAsObservable = bindCallback(soda.get);

export function get$ (params) {
  return getAsObservable.call(soda, params);
}
