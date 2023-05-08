<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import ballpath from './ballpath'
const canvas = ref(null);

const numPoints = ref(5);
const numSides = ref(4);
const offset = ref(0.05);
const rotation = ref(0);
const offsetRotation = ref(-0.1);
const curved = ref(false);
const drawPath = ref(false);

// Define animation function
let f = 0

const animate = () => {
  if (canvas.value) {
    /**@type {CanvasRenderingContext2D} */
    const ctx = canvas.value.getContext('2d');
    ctx.resetTransform()
    ctx.restore()
    ctx.save()
    // Set canvas dimensions
    // canvas.value.width = window.innerWidth;
    // canvas.value.height = window.innerHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    // Draw something on canvas
    // ctx.fillStyle = 'red';
    // ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    f += 0.002
    f = f % 1

    let r = 100
    let r1 = 5
    let r2 = r - r1
    ctx.translate(canvas.value.width / 2, canvas.value.height / 2)

    ctx.beginPath()
    ctx.ellipse(0, 0, r, r, 0, 0, Math.PI * 2, false)
    ctx.closePath()
    ctx.stroke()

    let NP = numPoints.value
    let NS = numSides.value
    let o = offset.value
    let rot = rotation.value
    let o1 = 0
    let o2 = 0
    let o0 = offsetRotation.value
    let c = curved.value

    if (c) {
      o2 = o0
    } else {
      o1 = o0
    }

    let points = ballpath(f, NP, NS, o, rot, o1, o2)
    for (let point of points) {
      ctx.beginPath()
      ctx.ellipse(point[0] * r2, point[1] * r2, r1, r1, 0, 0, Math.PI * 2, false)
      ctx.closePath()
      ctx.fill()
    }

    if (drawPath.value) {
      let points_list = []
      for (let f2 = 0; f2 <= 1; f2 += 0.005) {
        points = ballpath(f2, NP, NS, o, rot, o1, o2)
        points_list.push(points)
      }


      for (let i = 0; i < NP; i++) {
        ctx.strokeStyle = 'gray'
        if (i == NP - 1) ctx.strokeStyle = 'red'

        ctx.beginPath()
        for (let points of points_list) {
          ctx.lineTo(points[i][0] * r2, points[i][1] * r2)
        }
        ctx.closePath()
        ctx.stroke()
      }
    }



    ctx.restore()
    // Request next frame
    requestAnimationFrame(animate);
  }
};

// Set up animation loop on mount
onMounted(() => {
  requestAnimationFrame(animate);
});

// Remove animation loop on unmount
onUnmounted(() => {
  canvas.value = null;
});

</script>

<template>
  <div>
    <canvas ref="canvas" width="500" height="500" />
  </div>
</template>
