import {
  multiply,
  inc,
  identity,
  concat,
} from 'ramda';

import {
  bindCallback,
  interval,
} from 'rxjs';

import {
  first,
  map,
  combineLatest,
  takeWhile,
  mergeMap,
  scan,
} from 'rxjs/operators';

import {
  soda as api,
  get$,
} from '@/api/socrata';

const params = {
  $select: ['descent_cd', 'arst_date'],
  $limit: 1000,
  $order: 'rpt_id',
};

// So brittle
const maxRecords$ = get$({
  $select: 'count(*)',
})
  .pipe(
    first(),
    map(([error, response, data]) => Number(data[0].count))
  )

const timer$ = interval(1000);

const stream$ = timer$
  .pipe(
    map(multiply(params.$limit)),
    combineLatest(maxRecords$),
    takeWhile(
      ([offset, max]) =>
        offset + params.$limit <= max
    ),
    mergeMap(
      ([offset]) =>
        get$({
          ...params,
          offset,
        })
    ),
    map(
      ([error, response, data]) => data 
    ),
    scan(
      concat, [],
    ),
  )

export default stream$;
