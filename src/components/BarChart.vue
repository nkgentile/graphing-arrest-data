<template>
  <svg ref="container" />
</template>

<script>
  import arrests from '@/assets/arrest-data.json';

  import {
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
    mounted(){
      const whereEthnicityIs = propEq('descent_cd');

      const getArrestDate = prop('arst_date');
      const constructDate = d => new Date(d);
      const dates = map(
        pipe(
          getArrestDate,
          constructDate
        ),
        arrests
      );

      const arrestsByYear = countBy(
        (d) => d.getUTCFullYear(),
        dates
      );

      const data = pipe(
        toPairs,
        map( a => ({
          'year': a[0],
          'frequency': a[1],
        }))
      )(arrestsByYear);

      const width = 800;
      const height = 600;

      const x = scaleBand()
        .range([0, width])
        .domain(pluck('year', data))
        .padding(0.1)
      const y = scaleLinear()
        .range([height, 0])
        .domain([
          0,
          pipe(
            pluck('frequency'),
            max,
          )(data)
        ]);

      const { container } = this.$refs;
      const chart = select(container)
        .attr('width', width)
        .attr('height', height);

      const pointToX = pipe(
        prop('year'),
        x
      );

      const pointToY = pipe(
        prop('frequency'),
        y
      );

      const bars = chart.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', pointToX)
        .attr('width', x.bandwidth())
        .attr('y', pointToY)
        .attr('height', d => height - pointToY(d))
    },
  };
</script>

<style lang="less">
  .bar {
    fill: black;
  }
</style>
