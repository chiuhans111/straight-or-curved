<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import ballpath from './ballpath'
const canvas = ref(null)

const numPoints = ref(5)
const numSides = ref(4)
const separation = ref(0.3)
const rotation = ref(0)
const offsetRotation = ref(-40)
const curved = ref(false)
const drawPath = ref(false)
const drawCurve = ref(false)


// Define animation function
let f = 0
let c = 0

const animate = () => {
  if (canvas.value) {
    /**@type {CanvasRenderingContext2D} */
    const ctx = canvas.value.getContext('2d')
    ctx.resetTransform()
    ctx.restore()
    ctx.save()
    // Set canvas dimensions
    // canvas.value.width = window.innerWidth;
    // canvas.value.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // Draw something on canvas
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    f = new Date().getTime() / 7000 % 1

    let r = 150
    let r1 = 5
    let r2 = r - r1
    ctx.translate(canvas.value.width / 2, canvas.value.height / 2)

    ctx.beginPath()
    ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.stroke()



    let NP = numPoints.value
    let NS = numSides.value
    let o = 1 / NP * separation.value
    if (o == 0) {
      o = NP = 1
    }
    let rot = rotation.value * Math.PI / 180
    let o1 = 0
    let o2 = 0
    let o0 = offsetRotation.value * Math.PI / 180
    if (curved.value) {
      c += (1 - c) * 0.2
    } else {
      c += (0 - c) * 0.2
    }

    o2 = o0 * c
    o1 = o0 * (1 - c)


    let points = []

    ctx.lineWidth = 2
    if (drawPath.value) {
      let points_list = []
      for (let f2 = 0; f2 <= 1; f2 += 0.005) {
        points = ballpath(f2, NP, NS, o, rot, o1, o2)
        points_list.push(points)
      }


      for (let i = 0; i < NP; i++) {
        ctx.strokeStyle = 'lightgray'
        if (i == NP - 1) ctx.strokeStyle = 'gray'

        ctx.beginPath()
        for (let points of points_list) {
          ctx.lineTo(points[i][0] * r2, points[i][1] * r2)
        }
        ctx.closePath()
        ctx.stroke()
      }
    }

    if (drawCurve.value) {
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      let oo = NP * o / 1000
      points = ballpath(f, 1000, NS, oo, rot, o1, o2)
      for (let point of points) {
        ctx.lineTo(point[0] * r2, point[1] * r2)
      }
      ctx.stroke()
    }


    points = ballpath(f, NP, NS, o, rot, o1, o2)
    for (let point of points) {
      ctx.beginPath()
      ctx.ellipse(point[0] * r2, point[1] * r2, r1, r1, 0, 0, Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
    }
    ctx.restore()
    // Request next frame
    requestAnimationFrame(animate)
  }
}

// Set up animation loop on mount
onMounted(() => {
  requestAnimationFrame(animate)
})

// Remove animation loop on unmount
onUnmounted(() => {
  canvas.value = null
});

</script>

<template>
  <div class="input-row">
    <span>Number of points:</span>
    <input type="range" min="1" max="10" v-model="numPoints">
    <input type="number" v-model="numPoints">
  </div>
  <div class="input-row">
    <span>Number of sides:</span>
    <input type="range" min="2" max="10" v-model="numSides">
    <input type="number" v-model="numSides">
  </div>
  <div class="input-row">
    <span>Separation:</span>
    <input type="range" min="0" max="1" step="0.001" v-model="separation">
    <input type="number" v-model="separation">
  </div>
  <div class="input-row">
    <span>Rotate:</span>
    <input type="range" min="0" max="360" v-model="rotation">
    <input type="number" v-model="rotation">
  </div>
  <div class="input-row">
    <span>Offset:</span>
    <input type="range" min="-180" max="180" v-model="offsetRotation">
    <input type="number" v-model="offsetRotation">
  </div>
  <div class="input-row">
    <span>Curve Path:</span>
    <input type="checkbox" v-model="curved">
  </div>
  <div class="input-row">
    <span>Draw Path:</span>
    <input type="checkbox" v-model="drawPath">
  </div>

  <div class="input-row">
    <span>Draw Curve:</span>
    <input type="checkbox" v-model="drawCurve">
  </div>
  <div>
    <canvas ref="canvas" width="400" height="400" />
  </div>
</template>

<style lang="scss">
.input-row {
  margin: 8px;
  padding: 4px;
  display: flex;
  span {
    display: inline-block;
    width: 20%;
    max-width: 150px;
    min-width: 90px;
  }
  input[type=range]{
    flex-grow: 1;
  }
  max-width: 700px;
}

input[type=number] {
  max-width: 60px;
}
</style>