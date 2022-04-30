<template>
  <div class="app-container">
    <strong>{{ name }}</strong>管理的活动:
    <ul>
      <li v-for="game in avatar" :key="game">
        {{ game }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Dashboard',
  data() {
    return {
      games: []
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar'
    ])
  }
}
</script>

<style scoped>

</style>
