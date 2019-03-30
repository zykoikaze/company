<template>
  <div class="box">
    <el-container class=" is-vertical">
      <app-header />
    </el-container>
    <router-view />
  </div>
</template>

<script>
import AppHeader from './AppHeader'
export default {
  name: 'app-layout',
  components:{AppHeader},
}
</script>