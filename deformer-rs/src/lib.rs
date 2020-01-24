use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn deformer(position: &mut [f32], orig_position: &[f32], angle: f32) {
	for i in (0..position.len()).step_by(3) {
		let x = orig_position[i];
		let y = orig_position[i + 1];
		let z = orig_position[i + 2];

		let len_sq = (x * x) + (y * y) + (z * z);
		let theta = len_sq * angle;
		let c = theta.cos();
		let s = theta.sin();

		position[i] = c * x - s * z;
		position[i + 1] = y;
		position[i + 2] = s * x + c * z;
	}
}
