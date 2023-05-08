function ballpath(
    factor,
    numBalls,
    numSides,
    offsetFac,
    globalRotation,
    offsetRotation1,
    offsetRotation2,
) {
    let points = []


    for (let i = 0; i < numBalls; i++) {
        let f = (factor + i * offsetFac) % 1
        let f3 = factor - Math.floor(factor + i * offsetFac)
        let f2 = (f * numSides) % 1
        let j = Math.floor(f * numSides)

        let a0 = globalRotation + offsetRotation1 * i / numBalls - offsetRotation2 / offsetFac / numBalls * f3
        let da = (Math.PI * 2 + offsetRotation2 / offsetFac / numBalls) / numSides
        let a1 = j * da + a0
        let a2 = a1 + da

        let x1 = Math.cos(a1)
        let y1 = Math.sin(a1)

        let x2 = Math.cos(a2)
        let y2 = Math.sin(a2)

        let x = x2 * f2 + x1 * (1 - f2)
        let y = y2 * f2 + y1 * (1 - f2)

        points.push([x, y])
    }

    return points
}

export default ballpath