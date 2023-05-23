<template>
  <div id="app">
    <!-- <ModelViewer/> -->
    <ModelEditor/>
  </div>
</template>

<script>
// import ModelViewer from './components/ModelViewer.vue'
import ModelEditor from './components/ModelEditor.vue'

export default {
  name: 'App',
  components: {
    // ModelViewer,
    ModelEditor
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  height: 100vh;
}
</style>
