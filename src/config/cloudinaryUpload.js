import multer from 'multer';
import https from 'https';
import querystring from 'querystring';

// Use memory storage to handle file in RAM
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max file size
});

// Helper to convert buffer to base64
const bufferToBase64 = (buffer) => {
  return buffer.toString('base64');
};

// Direct Cloudinary upload using signed requests
export const uploadToCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    try {
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        const err = `Missing Cloudinary credentials. Check: CLOUDINARY_CLOUD_NAME=${cloudName}, CLOUDINARY_API_KEY=${apiKey ? 'SET' : 'MISSING'}, CLOUDINARY_API_SECRET=${apiSecret ? 'SET' : 'MISSING'}`;
        console.error('Cloudinary Credentials Error:', err);
        throw new Error(err);
      }

      // Create multipart boundary
      const boundary = `----WebKitFormBoundary${Date.now()}`;
      
      // Build multipart form data manually
      const parts = [];
      
      // Add file parameter
      parts.push(Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
        `Content-Type: application/octet-stream\r\n\r\n`
      ));
      parts.push(fileBuffer);
      parts.push(Buffer.from('\r\n'));

      // Add api_key parameter (for authentication)
      parts.push(Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="api_key"\r\n\r\n` +
        `${apiKey}\r\n`
      ));

      // Add folder parameter
      parts.push(Buffer.from(
        `--${boundary}\r\n` +
        `Content-Disposition: form-data; name="folder"\r\n\r\n` +
        `pcm-lifesciences\r\n`
      ));

      // End boundary
      parts.push(Buffer.from(`--${boundary}--\r\n`));

      // Combine all parts
      const body = Buffer.concat(parts);

      const options = {
        hostname: 'api.cloudinary.com',
        port: 443,
        path: `/v1_1/${cloudName}/image/upload`,
        method: 'POST',
        headers: {
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Length': body.length,
        },
      };

      console.log(`[Cloudinary] Uploading ${filename} to cloud: ${cloudName}`);

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk.toString();
        });

        res.on('end', () => {
          console.log(`[Cloudinary] Response status: ${res.statusCode}`);
          
          if (res.statusCode === 200 || res.statusCode === 401) {
            try {
              const data = JSON.parse(responseData);
              
              if (data.secure_url) {
                console.log(`[Cloudinary] Upload success: ${data.secure_url}`);
                resolve({
                  url: data.secure_url,
                  publicId: data.public_id,
                  success: true,
                });
              } else if (data.error) {
                console.error(`[Cloudinary] Error: ${data.error.message}`);
                reject(new Error(`Cloudinary Error: ${data.error.message}`));
              } else {
                console.error('[Cloudinary] Unknown response:', data);
                reject(new Error('Cloudinary: Unknown response format'));
              }
            } catch (parseErr) {
              console.error('[Cloudinary] JSON parse error:', parseErr.message);
              console.error('[Cloudinary] Response body:', responseData);
              reject(new Error(`Failed to parse Cloudinary response: ${parseErr.message}`));
            }
          } else {
            try {
              const errorData = JSON.parse(responseData);
              console.error(`[Cloudinary] API Error ${res.statusCode}:`, errorData);
              reject(new Error(`Cloudinary API Error ${res.statusCode}: ${errorData.error?.message || 'Unknown error'}`));
            } catch {
              console.error(`[Cloudinary] Error ${res.statusCode}:`, responseData);
              reject(new Error(`Cloudinary Upload Failed (${res.statusCode})`));
            }
          }
        });
      });

      req.on('error', (error) => {
        console.error('[Cloudinary] Request error:', error.message);
        reject(new Error(`Cloudinary connection error: ${error.message}`));
      });

      req.write(body);
      req.end();

    } catch (error) {
      console.error('[Cloudinary] Setup error:', error.message);
      reject(error);
    }
  });
};

      req.write(body);
      req.end();
    } catch (error) {
      reject(error);
    }
  });
};

// Fallback local storage for when REST API fails
const localStoragePath = path.join(process.cwd(), 'uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(localStoragePath)) {
  fs.mkdirSync(localStoragePath, { recursive: true });
}

// Fallback upload handler (local storage)
export const uploadToLocal = (fileBuffer, filename) => {
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const finalFilename = `${path.basename(filename, path.extname(filename))}-${uniqueSuffix}${path.extname(filename)}`;
    const filepath = path.join(localStoragePath, finalFilename);

    fs.writeFileSync(filepath, fileBuffer);

    return {
      url: `${process.env.API_BASE_URL || 'http://localhost:5000'}/uploads/${finalFilename}`,
      filename: finalFilename,
      success: true,
    };
  } catch (error) {
    console.error('Local upload error:', error);
    throw error;
  }
};
