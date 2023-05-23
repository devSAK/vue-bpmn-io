<template>
  <div class="hello">
    <h1>To-Dos Editor</h1>
    <div class="content" id="js-drop-zone"></div>
    <div class="navigation">
      <div class="note">Create a diagram and it will automatically be saved for this session.You can refresh the page, but if you close your browser window and you don't download your diagram,you will lose all changes.
      </div>
      <ul class="buttons">
        <li>
          <a href v-on:click="resetDiagram">Reset Diagram</a>
        </li>
        <li>
          <a id="js-download-diagram" :href="diagramUrl" v-bind:download="diagramName" title="download BPMN diagram">Download as BPMN diagram</a>
        </li>
        <li>
          <a id="js-download-svg" :href="svgUrl" v-bind:download="svgName" title="download as SVG image">Donwload as SVG image</a>
        </li>
        <li>
          <a href v-on:click="centerDiagram">Center Diagram</a>
        </li>
      </ul>
    </div>
    <div class="canvas" id="canvas"></div>
    <div id="properties"></div>
  </div>
</template>
<script lang="js">
// import BpmnModeler from 'bpmn-js/lib/Modeler'
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
// import propertiesPanelModule from 'bpmn-js-properties-panel'
import {
  parseBPMNJson,
  getBlankDiagramDownloadUrl,
  openLocalDiagram,
  resetDiagramToBlank,
  saveDiagram
} from '../assets/diagram-utils.js'
import style from 'bpmn-js/dist/assets/diagram-js.css' // eslint-disable-line no-unused-vars
import icons from 'bpmn-font/dist/css/bpmn-embedded.css' // eslint-disable-line no-unused-vars
import '../assets/styles.css'
import CustomModeler from '../assets/CustomBpmnModeler.js'

export default {
  name: 'ModelEditor',
  props: ['xml'],
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      modeler: null,
      diagramUrl: getBlankDiagramDownloadUrl(),
      diagramName: 'diagram.bpmn',
      svgUrl: 'data:application/bpmn20-xml;charset=UTF-8,hello',
      svgName: 'diagram.svg'
    }
  },
  methods: {
    resetDiagram (ev) {
      ev.preventDefault()
      resetDiagramToBlank(this.modeler)
    },
    centerDiagram (ev) {
      ev.preventDefault()
      const self = this
      self.modeler.get('canvas').zoom('fit-viewport')
      saveDiagram(self.modeler).then(url => {
        self.diagramUrl = url
        console.log('Saved')
      })
    }
  },
  mounted () {
    console.log(CustomModeler.prototype._modules)
    // const modules = []
    // for (const i in BpmnModeler.prototype._modules) {
    //   const mod = BpmnModeler.prototype._modules[i]
    //   console.log(i, mod.__init__, mod)
    //   if (mod.__init__ && mod.__init__[0] === 'paletteProvider') {
    //     mod.paletteProvider = ['type', CustomPalette]
    //   }
    //   if (mod.__init__ && mod.__init__[0] === 'contextPadProvider') {
    //     mod.contextPadProvider = ['type', CustomContextPadProvider]
    //   }
    //   if (mod.__init__ && mod.__init__[0] === 'moveCanvas') {
    //     mod.moveCanvas = CustomMoveCanvas
    //   }
    //   modules.push(mod)
    // }
    // modules.push(CustomMoveCanvas)
    this.$nextTick(() => {
      this.modeler = new CustomModeler({
        x: 100,
        container: '#canvas'
        // propertiesPanel: {
        //   parent: '#properties'
        // },
        // additionalModules: [
        //   propertiesPanelModule,
        //   propertiesProviderModule
        // ],
        // needed if you'd like to maintain camunda:XXX properties in the properties panel
        // moddleExtensions: {
        //   camunda: camundaModdleDescriptor
        // }
      })
      // console.log('modeler', JSON.stringify(this.modeler._modules))
      const modeler = this.modeler
      modeler.on('element.changed', function (event) {
        // const element = event.element
        if (event.gfx) {
          // console.log(event.gfx.textContent);
        }
        // the element got changed by the users
      })
      const self = this
      modeler.on('commandStack.changed', () => {
        const definitions = modeler.get('canvas').getRootElement().businessObject.$parent
        parseBPMNJson(definitions)
        // console.log(JSON.stringify(definitions))
        saveDiagram(modeler).then(url => {
          self.diagramUrl = url
        })
        modeler.saveSVG(function (err, svg) {
          if (err) {
            self.svgUrl = `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(svg)}`
          }
        })
      })
      openLocalDiagram(modeler)
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.canvas {
  width: 100%;
  height: 70vh;
}
</style>
