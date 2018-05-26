<template>
  <BarChart :data="arrests$"/>
</template>

<script>
  import {
    concat,
  } from 'ramda';

  import arrests$ from '@/api/arrests';
  import BarChart from '@/components/BarChart';

  export default {
    name: 'home',
    
    components: {
      BarChart,
    },

    subscriptions(){
      return {
        arrests$,
      }
    },
  }
</script>
