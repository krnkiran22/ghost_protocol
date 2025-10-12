import { NextRequest, NextResponse } from 'next/server';
import { uploadToPinata } from '@/lib/pinata';

export async function POST(request: NextRequest) {
  try {
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'text/plain',
      'application/epub+zip',
      'image/jpeg',
      'image/png',
      'audio/mpeg',
      'audio/wav',
      'video/mp4',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported' },
        { status: 400 }
      );
    }

    // Upload to Pinata
    const result = await uploadToPinata(file);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        ipfsHash: result.ipfsHash,
        ipfsUrl: result.ipfsUrl,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        timestamp: result.timestamp,
      },
    });
  } catch (error: any) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Failed to upload file'
      },
      { status: 500 }
    );
  }
}