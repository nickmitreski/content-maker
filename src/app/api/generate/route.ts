import { NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: Request) {
  try {
    // Log API token presence (without exposing the actual token)
    console.log('API Token present:', !!process.env.REPLICATE_API_TOKEN);
    
    const { prompt, type = 'video' } = await req.json();
    console.log('Received prompt:', prompt);
    console.log('Generation type:', type);

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Calling Replicate API...');
    
    let output;
    
    if (type === 'video') {
      output = await replicate.run(
        "wan-video/wan-2.1-1.3b",
        {
          input: {
            prompt: prompt,
            frame_num: 81,
            resolution: "480p",
            aspect_ratio: "16:9",
            sample_shift: 8,
            sample_steps: 30,
            sample_guide_scale: 6
          }
        }
      );
    } else if (type === 'image') {
      output = await replicate.run(
        "black-forest-labs/flux-1.1-pro",
        {
          input: {
            prompt: prompt,
            prompt_upsampling: true,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 80,
            safety_tolerance: 2
          }
        }
      );
    } else {
      return NextResponse.json(
        { error: 'Invalid generation type. Must be "video" or "image".' },
        { status: 400 }
      );
    }
    
    console.log('Replicate API response type:', typeof output);
    console.log('Replicate API response:', output);
    
    if (!output) {
      throw new Error('No output received from Replicate API');
    }

    // Handle ReadableStream response (for video)
    if (output instanceof ReadableStream) {
      console.log('Handling ReadableStream response...');
      const reader = output.getReader();
      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
      }
      
      // Concatenate all chunks into a single Uint8Array
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const concatenated = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        concatenated.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Convert to base64
      const base64Data = Buffer.from(concatenated).toString('base64');
      const contentUrl = `data:video/mp4;base64,${base64Data}`;
      console.log('Processed content URL (first 100 chars):', contentUrl.substring(0, 100) + '...');
      return NextResponse.json({ output: contentUrl, type: 'video' });
    }
    
    // Handle string or object response (for image)
    let contentUrl = '';
    if (typeof output === 'string') {
      contentUrl = output;
    } else if (typeof output === 'object') {
      contentUrl = (output as any).url || (output as any).output || JSON.stringify(output);
    }
    
    if (!contentUrl) {
      throw new Error('Could not extract content URL from response');
    }
    
    console.log('Content URL (first 100 chars):', contentUrl.substring(0, 100) + '...');
    return NextResponse.json({ output: contentUrl, type: 'image' });
    
  } catch (error) {
    console.error('Detailed error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    console.error('Error name:', error instanceof Error ? error.name : 'Unknown error type');
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to generate content',
        details: error instanceof Error ? error.stack : 'No additional details available'
      },
      { status: 500 }
    );
  }
} 