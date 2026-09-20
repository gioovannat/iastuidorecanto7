/**
 * Utility to compress, downscale, and optimize image files before storing.
 * Converts raw camera/mobile photos (which can be 5MB - 20MB) into lightweight,
 * high-clarity WebP/JPEG data URLs (typically 40KB - 250KB), preventing
 * localStorage / IndexedDB quota overflows and speeding up rendering.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export async function optimizeImageFile(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const { maxWidth = 1280, maxHeight = 1280, quality = 0.82 } = options;

  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('O arquivo selecionado não é uma imagem válida.'));
    }

    // SVGs do not need bitmap canvas re-encoding
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Erro ao ler arquivo SVG.'));
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      if (!rawDataUrl) {
        return reject(new Error('Falha ao processar arquivo de imagem.'));
      }

      const img = new Image();
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate downscaled dimensions while preserving aspect ratio
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.max(1, Math.round(width * ratio));
            height = Math.max(1, Math.round(height * ratio));
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Canvas 2d context unavailable, return raw data url safely
            return resolve(rawDataUrl);
          }

          // Smooth resampling
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          ctx.drawImage(img, 0, 0, width, height);

          // Attempt WebP first, fallback to JPEG
          let output = '';
          try {
            output = canvas.toDataURL('image/webp', quality);
            if (!output.startsWith('data:image/webp')) {
              output = canvas.toDataURL('image/jpeg', quality);
            }
          } catch {
            output = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(output);
        } catch (err) {
          console.warn('Canvas optimization fallback to original source:', err);
          resolve(rawDataUrl);
        }
      };

      img.onerror = () => {
        // If image object fails to decode, fallback to raw data
        resolve(rawDataUrl);
      };

      img.src = rawDataUrl;
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo do dispositivo.'));
    reader.readAsDataURL(file);
  });
}
