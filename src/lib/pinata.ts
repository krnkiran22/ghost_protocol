import pinataSDK from '@pinata/sdk';

// Initialize Pinata client
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY!,
  process.env.PINATA_SECRET_KEY!
);

// Test authentication
export async function testPinataConnection() {
  try {
    await pinata.testAuthentication();
    console.log('✅ Pinata connection successful');
    return true;
  } catch (error) {
    console.error('❌ Pinata connection failed:', error);
    return false;
  }
}

// Upload file to IPFS
export async function uploadToPinata(file: File) {
  try {
    // Convert File to Buffer for Node.js environment
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create readable stream
    const stream = require('stream');
    const readableStream = new stream.Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    // Upload to Pinata
    const result = await pinata.pinFileToIPFS(readableStream, {
      pinataMetadata: {
        name: file.name,
      },
      pinataOptions: {
        cidVersion: 0,
      },
    });

    return {
      success: true,
      ipfsHash: result.IpfsHash,
      ipfsUrl: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      size: result.PinSize,
      timestamp: result.Timestamp,
    };
  } catch (error) {
    console.error('Pinata upload error:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

// Unpin file from IPFS (optional cleanup)
export async function unpinFromPinata(ipfsHash: string) {
  try {
    await pinata.unpin(ipfsHash);
    return { success: true };
  } catch (error) {
    console.error('Unpin error:', error);
    return { success: false };
  }
}