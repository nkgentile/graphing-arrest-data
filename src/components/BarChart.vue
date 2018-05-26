<template>
  <svg
    ref="container"
    :width="width"
    :height="height"
  >
    <rect
      v-for="(d, i) in chart"
      class="bar"
      :x="pointToX(d)"
      :y="pointToY(d)"
      :width="x.bandwidth()"
      :height="height - pointToY(d)"
    />
  </svg>
</template>

<script>
  import arrests from '@/api/arrests';

  import {
    multiply,
    T,
    filter,
    propEq,
    prop,
    map,
    construct,
    pipe,
    countBy,
    values,
    toPairs,
    pluck,
    inc,
    identity,
  } from 'ramda';

  import {
    scaleBand,
    scaleLinear,
  } from 'd3-scale';

  import {
    select,
  } from 'd3-selection';

  import {
    max,
  } from 'd3-array';

  export default {

    props: {
      data: {
        type: Array,
        default: () => [],
      },

      width: {
        type: Number,
        default: 800,
      },

      height: {
        type: Number,
        default: 600,
      },
    },

    computed: {
      dates(){
        return map(
          pipe(
            prop('arst_date'),
            d => new Date(d)
          ),
          this.data
        );
      },

      arrestsByYear(){
        return countBy(
          (d) => d.getUTCFullYear(),
          this.dates
        );
      },

      chart(){
        return pipe(
          toPairs,
          map( a => ({
            'year': a[0],
            'frequency': a[1],
          }))
        )(this.arrestsByYear);
      },

      x(){
        return scaleBand()
          .range([0, this.width])
          .domain(pluck('year', this.chart))
          .padding(0.1)
      },

      y(){
        return scaleLinear()
          .range([this.height, 0])
          .domain([
            0,
            pipe(
              pluck('frequency'),
              max,
            )(this.chart)
          ]);
      },
      pointToX(){
        return pipe(
          prop('year'),
          this.x
        );
      },
      pointToY(){
        return pipe(
          prop('frequency'),
          this.y
        );
      },
    },

    methods: {
      whereEthnicityIs: propEq('descent_cd'),
    },
  };
</script>

<style lang="less">
  .bar {
    fill: black;
  }
</style>
