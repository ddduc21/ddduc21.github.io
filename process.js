/** @argument {ImageData} image*/
function process(image, threshold) {
  const grayscale = [];
  const size = image.width * image.height;
  for (let i = 0; i < size; i++) {
    const r = image.data[i * 4];
    const g = image.data[i * 4 + 1];
    const b = image.data[i * 4 + 2];
    grayscale[i] = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  const gradient_x = convolution(grayscale, image.width, image.height, [
    [1, 0, -1],
    [2, 0, -2],
    [1, 0, -1],
  ]);

  const gradient_y = convolution(grayscale, image.width, image.height, [
    [ 1,  2,  1],
    [ 0,  0,  0],
    [-1, -2, -1],
  ]);

  for (let i = 0; i < size; i++) {
		const g = Math.sqrt(
			gradient_x[i] * gradient_x[i] + gradient_y[i] * gradient_y[i]
		);
	
		const color = sigmoid(g, threshold);
		// const color = step(g, threshold);
	
		image.data[i * 4]     = color;
	  image.data[i * 4 + 1] = color;
	  image.data[i * 4 + 2] = color;
		image.data[i * 4 + 3] = 255;

    // image.data[i * 4] 		= g;
    // image.data[i * 4 + 1] = g;
    // image.data[i * 4 + 2] = g;
    // image.data[i * 4 + 3] = 255;
  }

  return image;
}

/**
 * @argument {[number]} data
 * @argument {[[number]]} kernel
 * */
function convolution(data, w, h, kernel) {
  const k_h = kernel.length;
  const k_w = kernel[0]?.length;
  const x_start = -(k_w / 2).toFixed(0);
  const y_start = -(k_h / 2).toFixed(0);
  const size = w * h;
  const result = [];

  if (!w || !h) {
    return data;
  }

  for (let i = 0; i < size; i++) {
    let c = 0;
    for (let j = 0; j < k_w; j++) {
      for (let k = 0; k < k_h; k++) {
        const index = i + x_start + j + (y_start + k) * w;
        if (0 <= index && index < size) {
          c += data[index] * kernel[k][j];
        }
      }
    }
    result[i] = c;
  }

  return result;
}

function sigmoid(x, threshold) {
	return 255 / (1 + Math.exp((x - threshold) / 5));
}

function step(x, threshold) {
	return x >= threshold ? 0 : 255;
}
