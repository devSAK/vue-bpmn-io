import { decompress, compress } from 'lz-string'
// import blankDiagram from '../assets/blank.bpmn'

export function openDiagram (modeler, diagramXml) {
  modeler.importXML(diagramXml, function (err) {
    if (!err) {
      console.log('success!')
      modeler.get('canvas').zoom('fit-viewport')
      // console.log(modeler.get("canvas").zoom)
    } else {
      console.log('something went wrong:', err)
    }
  })
  console.log(modeler.get('canvas'))
  modeler.get('canvas').zoom('fit-viewport')
}

const blankDiagram = `<?xml version="1.0" encoding="UTF-8"?>
<semantic:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
xmlns:semantic="http://www.omg.org/spec/BPMN/20100524/MODEL" id="_1275940932088"
targetNamespace="http://www.trisotech.com/definitions/_1275940932088">
<semantic:message id="_1275940932310" />
<semantic:message id="_1275940932433" />
<semantic:message id="_1275940932198" />
<semantic:process id="_6-2" isExecutable="false">
<semantic:startEvent id="_6-61" name="Start" />
</semantic:process>
<semantic:collaboration id="C1275940932557">
<semantic:participant id="_6-53" name="Process Name" processRef="_6-2" />
</semantic:collaboration>
<bpmndi:BPMNDiagram id="Trisotech.Visio-_6" name="Untitled Diagram" documentation=""
resolution="96.00000267028808">
<bpmndi:BPMNPlane bpmnElement="C1275940932557">
<bpmndi:BPMNShape id="Trisotech.Visio__6-53" bpmnElement="_6-53"
isHorizontal="true">
<dc:Bounds x="175" y="62" width="723" height="251" />
<bpmndi:BPMNLabel />
</bpmndi:BPMNShape>
<bpmndi:BPMNShape id="Trisotech.Visio__6__6-61" bpmnElement="_6-61">
<dc:Bounds x="229" y="146" width="30" height="30" />
<bpmndi:BPMNLabel>
<dc:Bounds x="233" y="176" width="24" height="14" />
</bpmndi:BPMNLabel>
</bpmndi:BPMNShape>
</bpmndi:BPMNPlane>
</bpmndi:BPMNDiagram>
</semantic:definitions>
`
export function openLocalDiagram (modeler) {
  const localDiagram = sessionStorage.getItem('diagram')
  const diagram = localDiagram ? decompress(localDiagram) : blankDiagram
  return openDiagram(modeler, diagram)
}
export function resetDiagramToBlank (modeler) {
  return openDiagram(modeler, blankDiagram)
}
export function saveDiagram (modeler) {
  return new Promise(resolve => {
    modeler.saveXML({ format: true }, function (err, xml) {
      sessionStorage.setItem('diagram', compress(xml))
      resolve(getDownloadUrl(xml))
      if (err) {
        console.error('An error occured:', err)
      }
    })
  })
}
export function getDownloadUrl (xml) {
  return `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(xml)}`
}
export function getBlankDiagramDownloadUrl () {
  return getDownloadUrl(blankDiagram)
}
export function parseBPMNJson ({ rootElements }) {
  // console.log(rootElements);
  const steps = rootElements
    .filter(el => el.$type === 'bpmn:Process')
    .reduce((acc, curr) => curr.flowElements)
    /*  .map(el => el.flowElements)
    .map(el => ({
    type: el.$type,
    name: el.name
    }))
    .forEach(console.log);
    */
  console.log(steps)
}
