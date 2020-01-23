export default function deformer(position, origPosition, angle) {
	for (let i = 0, last = position.length; i < last; i += 3) {
		const x = origPosition[i],
			y = origPosition[i + 1],
			z = origPosition[i + 2];

		const lenSq = (x * x) + (y * y) + (z * z);
		const theta = lenSq * angle;
		const c = Math.cos(theta);
		const s = Math.sin(theta);

		position[i] = c * x - s * z;
		position[i + 1] = y;
		position[i + 2] = s * x + c * z;
	}
}

