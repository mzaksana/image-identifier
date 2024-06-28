import SparkMD5 from "spark-md5";

export interface ImageAnalysisResult {
	md5real: string;
	totalEdge: number;
	sumPixelColor: number;
	totalPixel: number;
	md5grey: string;
 }
 
 export async function getMd5(arrayBuffer: ArrayBuffer): Promise<string> {
	const spark = new SparkMD5.ArrayBuffer();
	spark.append(arrayBuffer);
	return spark.end();
 }
 
 export async function createSHA256Hash(inputString: string): Promise<string> {
	const encoder = new TextEncoder();
	const data = encoder.encode(inputString);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
	return hashHex;
 }
 
 export async function ImageIdentifier(imageData: ArrayBuffer | File): Promise<string> {
	const data = await analyzeImage(imageData);
	const sha256Hash = await createSHA256Hash(JSON.stringify(data));
	return sha256Hash;
 }
 
 export async function analyzeImage(imageData: ArrayBuffer | File): Promise<ImageAnalysisResult> {
	// This function will be implemented separately for browser and Node.js
	throw new Error("analyzeImage is not implemented");
 }
 