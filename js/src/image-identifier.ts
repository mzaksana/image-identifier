import { ImageAnalysisResult, getMd5, analyzeImage as commonAnalyzeImage } from './index';

async function analyzeImage(imageData: File): Promise<ImageAnalysisResult> {
  const img = new Image();
  img.src = URL.createObjectURL(imageData);
  await img.decode();

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  ctx!.drawImage(img, 0, 0);

  const originalArrayBuffer = await imageData.arrayBuffer();
  const originalMd5 = await getMd5(originalArrayBuffer);

  const imageDataObj = ctx!.getImageData(0, 0, img.width, img.height);
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

  ctx!.putImageData(imageDataObj, 0, 0);

  const grayBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve));
  if (!grayBlob) {
    throw new Error("Failed to create blob from canvas");
  }
  const grayArrayBuffer = await grayBlob.arrayBuffer();
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
