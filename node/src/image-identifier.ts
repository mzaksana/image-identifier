import { ImageAnalysisResult, getMd5, analyzeImage as commonAnalyzeImage } from './index';
import { createCanvas, loadImage } from 'canvas';

async function analyzeImage(imageData: ArrayBuffer): Promise<ImageAnalysisResult> {
  const img = await loadImage(Buffer.from(imageData));

  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0, img.width, img.height);

  const originalMd5 = await getMd5(imageData);

  const imageDataObj = ctx.getImageData(0, 0, img.width, img.height);
  let totalEdge = 0;
  let sumPixelColor = 0;
  const totalPixel = img.width * img.height;

  for (let i = 0; i < imageDataObj.data.length; i += 4) {
    const avg = (imageDataObj.data[i] + imageDataObj.data[i + 1] + imageDataObj.data[i + 2]) / 3;
    imageDataObj.data[i] = avg;
    imageDataObj.data[i + 1] = avg;
    imageDataObj.data[i + 2] = avg;

    sumPixelColor += avg;
    if (avg < 10) totalEdge++;
  }

  ctx.putImageData(imageDataObj, 0, 0);

  const grayBuffer = canvas.toBuffer('image/png');
  const grayArrayBuffer = grayBuffer.buffer.slice(grayBuffer.byteOffset, grayBuffer.byteOffset + grayBuffer.byteLength);
  const grayMd5 = await getMd5(grayArrayBuffer);

  return {
    md5real: originalMd5,
    totalEdge,
    sumPixelColor,
    totalPixel,
    md5grey: grayMd5,
  };
}

export { analyzeImage };
