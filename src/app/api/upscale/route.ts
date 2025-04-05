import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    const { image, prompt, creativity = 0.4 } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const input = {
      image,
      prompt: prompt || "enhance this image, 4k, high quality, detailed",
      creativity: parseFloat(creativity),
      negative_prompt: "Teeth, tooth, open mouth, longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, mutant",
      lora_details_strength: -0.25,
      lora_sharpness_strength: 0.75
    };

    const output = await replicate.run(
      "fermatresearch/high-resolution-controlnet-tile:8e6a54d7b2848c48dc741a109d3fb0ea2a7f554eb4becd39a25cc532536ea975",
      { input }
    );

    return NextResponse.json({ output });
  } catch (error) {
    console.error("Error in upscale route:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
} 