import { useEffect, useRef, useState } from 'react';

// Color palette - classic vibrant colors for DVD effect
const COLORS = [
  '#ff4d4d', // Red
  '#00e5ff', // Cyan
  '#ffe066', // Yellow
  '#7cff6b', // Green
  '#ff7ee2', // Magenta
  '#b388ff', // Violet
  '#ff9f43', // Orange
  '#ffffff', // White
];

/**
 * Custom hook for DVD-style bouncing logo animation
 * @param {string} imageDataURL - Image to animate
 * @param {boolean} isActive - Whether animation is playing
 * @param {number} speed - Playback speed multiplier (0.5 - 2.5)
 * @param {string} resolution - Output resolution (720p, 1080p, 1440p)
 * @returns {React.RefObject} Canvas ref for attaching to DOM
 */
export function useCanvasAnimation(imageDataURL, isActive, speed = 1.0, resolution = '1080p') {
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const imageRef = useRef(null);
  const tintCanvasRef = useRef(null);
  const stateRef = useRef({
    x: 0,
    y: 0,
    dx: 1,
    dy: 1,
    colorIndex: 0,
    lastTime: null,
  });

  // Resolution presets
  const resolutions = {
    '720p': { width: 1280, height: 720 },
    '1080p': { width: 1920, height: 1080 },
    '1440p': { width: 2560, height: 1440 },
  };

  const drawColorizedLogo = (ctx, img, x, y, width, height, color, overlayAlpha = 0.35) => {
    let tintCanvas = tintCanvasRef.current;
    if (!tintCanvas) {
      tintCanvas = document.createElement('canvas');
      tintCanvasRef.current = tintCanvas;
    }

    const w = Math.max(1, Math.round(width));
    const h = Math.max(1, Math.round(height));
    if (tintCanvas.width !== w || tintCanvas.height !== h) {
      tintCanvas.width = w;
      tintCanvas.height = h;
    }

    const tintCtx = tintCanvas.getContext('2d');
    tintCtx.clearRect(0, 0, w, h);

    // Draw the original image first so interior detail is preserved.
    tintCtx.drawImage(img, 0, 0, w, h);

    // Overlay color while keeping texture/shading from the source image.
    tintCtx.globalCompositeOperation = 'source-atop';
    tintCtx.globalAlpha = overlayAlpha;
    tintCtx.fillStyle = color;
    tintCtx.fillRect(0, 0, w, h);
    tintCtx.globalAlpha = 1;
    tintCtx.globalCompositeOperation = 'source-over';

    ctx.drawImage(tintCanvas, x, y, width, height);
  };

  // Load image when imageDataURL changes
  useEffect(() => {
    if (!imageDataURL) {
      imageRef.current = null;
      setImageLoaded(false);
      return;
    }

    setImageLoaded(false);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      const directionX = Math.random() > 0.5 ? 1 : -1;
      const directionY = Math.random() > 0.5 ? 1 : -1;
      stateRef.current = {
        x: 0,
        y: 0,
        dx: directionX,
        dy: directionY,
        colorIndex: 0,
        lastTime: null,
      };
      setImageLoaded(true);
    };
    img.onerror = () => {
      imageRef.current = null;
      setImageLoaded(false);
    };
    img.src = imageDataURL;
  }, [imageDataURL]);

  // Draw static preview when image is loaded and not animating
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;

    // Keep the preview static when animation is not active.
    if (!canvas || !img || !imageLoaded || isActive) {
      return;
    }

    const ctx = canvas.getContext('2d');
    const res = resolutions[resolution];

    canvas.width = res.width;
    canvas.height = res.height;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Calculate logo size (max 25% of canvas width)
    const maxLogoWidth = canvas.width * 0.25;
    const scale = Math.min(maxLogoWidth / img.width, canvas.height * 0.25 / img.height);
    const logoWidth = img.width * scale;
    const logoHeight = img.height * scale;

    // Center position
    const x = (canvas.width - logoWidth) / 2;
    const y = (canvas.height - logoHeight) / 2;

    stateRef.current.x = x;
    stateRef.current.y = y;
    stateRef.current.lastTime = null;

    // Draw static logo with detail-preserving tint and no glow.
    drawColorizedLogo(ctx, img, x, y, logoWidth, logoHeight, COLORS[stateRef.current.colorIndex]);
  }, [imageDataURL, resolution, imageLoaded, isActive]);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    const res = resolutions[resolution];

    // Set canvas size
    canvas.width = res.width;
    canvas.height = res.height;

    const animate = (timestamp) => {
      const img = imageRef.current;
      if (!img) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const state = stateRef.current;
      if (!state.lastTime) {
        state.lastTime = timestamp;
      }

      const dt = Math.min((timestamp - state.lastTime) / 1000, 0.05);
      state.lastTime = timestamp;

      // Clear canvas
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate logo size (max 25% of canvas width)
      const maxLogoWidth = canvas.width * 0.25;
      const scale = Math.min(maxLogoWidth / img.width, canvas.height * 0.25 / img.height);
      const logoWidth = img.width * scale;
      const logoHeight = img.height * scale;

      // Move at a stable speed regardless of frame rate.
      const pixelsPerSecond = 220 * speed;
      state.x += state.dx * pixelsPerSecond * dt;
      state.y += state.dy * pixelsPerSecond * dt;

      // Bounce off edges.
      let bounced = false;
      if (state.x <= 0) {
        state.x = 0;
        state.dx = 1;
        bounced = true;
      } else if (state.x + logoWidth >= canvas.width) {
        state.x = canvas.width - logoWidth;
        state.dx = -1;
        bounced = true;
      }

      if (state.y <= 0) {
        state.y = 0;
        state.dy = 1;
        bounced = true;
      } else if (state.y + logoHeight >= canvas.height) {
        state.y = canvas.height - logoHeight;
        state.dy = -1;
        bounced = true;
      }

      if (bounced) {
        state.colorIndex = (state.colorIndex + 1) % COLORS.length;
      }

      // Get current color
      const color = COLORS[state.colorIndex];

      // Draw logo with color swaps while preserving interior image detail (no glow).
      drawColorizedLogo(ctx, img, state.x, state.y, logoWidth, logoHeight, color);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, speed, resolution]);

  return canvasRef;
}

/**
 * Hook for managing MediaRecorder and video blob
 * @param {React.RefObject} canvasRef - Canvas element to record
 * @param {number} duration - Recording duration in seconds
 * @returns {Object} { isRecording, startRecording, stopRecording, videoBlob }
 */
export function useMediaRecorder(canvasRef, duration = 30) {
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const isRecordingRef = useRef(false);
  const blobRef = useRef(null);

  const startRecording = (onBlobReady) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    chunksRef.current = [];
    isRecordingRef.current = true;

    try {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus',
      });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        blobRef.current = blob;
        isRecordingRef.current = false;
        if (onBlobReady) {
          onBlobReady(blob);
        }
      };

      mediaRecorder.start();
      recorderRef.current = mediaRecorder;

      // Auto-stop after duration
      setTimeout(() => {
        if (recorderRef.current && recorderRef.current.state !== 'inactive') {
          recorderRef.current.stop();
        }
      }, duration * 1000);
    } catch (error) {
      console.error('Failed to start recording:', error);
      isRecordingRef.current = false;
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      recorderRef.current.stop();
    }
    isRecordingRef.current = false;
  };

  return {
    get isRecording() {
      return isRecordingRef.current;
    },
    startRecording,
    stopRecording,
    get videoBlob() {
      return blobRef.current;
    },
  };
}
