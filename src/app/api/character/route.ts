import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'

// Initialize the Replicate client
// The API token should be set in your .env.local file
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function POST(request: NextRequest) {
  try {
    // Check if API token is available
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('Replicate API token is missing')
      return NextResponse.json(
        { error: 'API configuration error. Please check your environment variables.' },
        { status: 500 }
      )
    }

    const { subject, prompt, numberOfOutputs = 3 } = await request.json()

    if (!subject || !prompt) {
      return NextResponse.json(
        { error: 'Subject and prompt are required' },
        { status: 400 }
      )
    }

    // Check if the subject is a base64-encoded image
    const isBase64Image = subject.startsWith('data:image')
    
    // Call the Replicate API
    const output = await replicate.run(
      "fofr/consistent-character:9c77a3c2f884193fcee4d89645f02a0b9def9434f9e03cb98460456b831c8772",
      {
        input: {
          prompt,
          subject: isBase64Image ? subject : subject,
          number_of_outputs: numberOfOutputs,
          output_format: "webp",
          output_quality: 80,
          randomise_poses: true,
        },
      }
    )

    return NextResponse.json({ output })
  } catch (error) {
    console.error('Error in character generation:', error)
    
    // Provide more detailed error information
    let errorMessage = 'Failed to generate characters'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
} 