import { useState, useRef } from 'react';
import { useCanvasAnimation } from './hooks/useCanvasAnimation';
import SectionTitle from './components/ui/SectionTitle';
import UploadArea from './components/sections/UploadArea';
import AnimationSettings from './components/sections/AnimationSettings';
import ExportSection from './components/sections/ExportSection';
import StatusDisplay from './components/ui/StatusDisplay';
import CanvasPreview from './components/CanvasPreview';

export default function App() {
  const EXPORT_FPS = 30;
  const MAX_EXPORT_SECONDS = 120;

  const [image, setImage] = useState(null);
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [resolution, setResolution] = useState('1080p');
  const [speed, setSpeed] = useState(1.0);
  const [fileName, setFileName] = useState('geeksaver-screensaver');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [status, setStatus] = useState('Ready to upload image');
  const fileInputRef = useRef(null);

  // Integrate animation hook
  const animatedCanvasRef = useCanvasAnimation(image, isPreviewActive, speed, resolution);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Always return to static preview when a new image is uploaded.
      setIsPreviewActive(false);
      setImage(e.target.result);
      setStatus('Image loaded, ready to preview');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  const handleGenerateAndDownload = async () => {
    if (!image) {
      setStatus('Please upload an image first');
      return;
    }

    if (isGenerating) {
      return;
    }

    const safeFileName = (fileName || 'geeksaver-screensaver').trim() || 'geeksaver-screensaver';
    const sanitizedName = safeFileName.replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_').replace(/\s+/g, '-');
    const exportedSpeed = Number(speed);
    const resolutionMap = {
      '720p': { width: 1280, height: 720 },
      '1080p': { width: 1920, height: 1080 },
      '1440p': { width: 2560, height: 1440 },
    };
    const selectedResolution = resolutionMap[resolution] || resolutionMap['1080p'];

    const mimeCandidates = [
      'video/mp4;codecs=avc1.42E01E,mp4a.40.2',
      'video/mp4;codecs=avc1.42E01E',
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];

    const supportedMime = mimeCandidates.find((mime) => MediaRecorder.isTypeSupported(mime));
    if (!supportedMime) {
      setStatus('Your browser cannot export video in a supported format');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(2);
    setStatus('Generating loop-ready screensaver video...');

    let generationSucceeded = false;

    try {
      const sourceImage = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load uploaded image for export'));
        img.src = image;
      });

      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = selectedResolution.width;
      exportCanvas.height = selectedResolution.height;
      const ctx = exportCanvas.getContext('2d');

      const tintCanvas = document.createElement('canvas');
      const tintCtx = tintCanvas.getContext('2d');
      const COLORS = ['#ff4d4d', '#00e5ff', '#ffe066', '#7cff6b', '#ff7ee2', '#b388ff', '#ff9f43', '#ffffff'];

      const maxLogoWidth = exportCanvas.width * 0.25;
      const maxLogoHeight = exportCanvas.height * 0.25;
      const scale = Math.min(maxLogoWidth / sourceImage.width, maxLogoHeight / sourceImage.height);
      const logoW = Math.max(1, Math.round(sourceImage.width * scale));
      const logoH = Math.max(1, Math.round(sourceImage.height * scale));

      const travelX = Math.max(1, exportCanvas.width - logoW);
      const travelY = Math.max(1, exportCanvas.height - logoH);
      const baseStep = Math.max(1, Math.round(4 * exportedSpeed));
      const stepX = baseStep;
      const stepY = Math.max(1, Math.round(baseStep * 0.75));

      const drawColorized = (drawX, drawY, color) => {
        const iw = Math.max(1, Math.round(logoW));
        const ih = Math.max(1, Math.round(logoH));

        if (tintCanvas.width !== iw || tintCanvas.height !== ih) {
          tintCanvas.width = iw;
          tintCanvas.height = ih;
        }

        tintCtx.clearRect(0, 0, iw, ih);
        tintCtx.drawImage(sourceImage, 0, 0, iw, ih);
        tintCtx.globalCompositeOperation = 'source-atop';
        tintCtx.globalAlpha = 0.35;
        tintCtx.fillStyle = color;
        tintCtx.fillRect(0, 0, iw, ih);
        tintCtx.globalAlpha = 1;
        tintCtx.globalCompositeOperation = 'source-over';

        ctx.drawImage(tintCanvas, drawX, drawY, logoW, logoH);
      };

      const stream = exportCanvas.captureStream(EXPORT_FPS);
      const recorder = new MediaRecorder(stream, { mimeType: supportedMime });
      const chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      const blobPromise = new Promise((resolve) => {
        recorder.onstop = () => {
          resolve(new Blob(chunks, { type: supportedMime }));
        };
      });

      let x = Math.round((exportCanvas.width - logoW) / 2);
      let y = Math.round((exportCanvas.height - logoH) / 2);
      let dx = Math.random() > 0.5 ? 1 : -1;
      let dy = Math.random() > 0.5 ? 1 : -1;
      let colorIndex = 0;
      const initialState = { x, y, dx, dy, colorIndex };

      const stepFrame = () => {
        let nextX = x + stepX * dx;
        let nextY = y + stepY * dy;
        let bounced = false;

        if (nextX <= 0) {
          nextX = 0;
          dx = 1;
          bounced = true;
        } else if (nextX >= travelX) {
          nextX = travelX;
          dx = -1;
          bounced = true;
        }

        if (nextY <= 0) {
          nextY = 0;
          dy = 1;
          bounced = true;
        } else if (nextY >= travelY) {
          nextY = travelY;
          dy = -1;
          bounced = true;
        }

        if (bounced) {
          colorIndex = (colorIndex + 1) % COLORS.length;
        }

        x = nextX;
        y = nextY;
      };

      const maxFrames = MAX_EXPORT_SECONDS * EXPORT_FPS;
      let detectedCycleFrames = null;
      for (let i = 1; i <= maxFrames; i += 1) {
        stepFrame();
        if (i % 60 === 0) {
          const scanProgress = Math.min(15, Math.round((i / maxFrames) * 15));
          setGenerationProgress(scanProgress);
        }
        if (
          x === initialState.x
          && y === initialState.y
          && dx === initialState.dx
          && dy === initialState.dy
          && colorIndex === initialState.colorIndex
        ) {
          detectedCycleFrames = i;
          break;
        }
      }

      // Reset simulation state for actual rendering.
      x = initialState.x;
      y = initialState.y;
      dx = initialState.dx;
      dy = initialState.dy;
      colorIndex = initialState.colorIndex;

      const totalFrames = detectedCycleFrames || (30 * EXPORT_FPS);
      const exportSeconds = (totalFrames / EXPORT_FPS).toFixed(1);
      setGenerationProgress(15);
      if (!detectedCycleFrames) {
        setStatus(`Generating ${exportSeconds}s screensaver video (near-seamless loop)...`);
      }

      let renderedFrames = 0;
      let timerId = null;

      const drawFrame = () => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        drawColorized(x, y, COLORS[colorIndex]);

        renderedFrames += 1;
        const renderProgress = 15 + Math.round((renderedFrames / totalFrames) * 80);
        setGenerationProgress(Math.min(95, renderProgress));
        if (renderedFrames >= totalFrames) {
          clearInterval(timerId);
          recorder.stop();
          return;
        }

        stepFrame();
      };

      recorder.start(1000);
      drawFrame();
      timerId = setInterval(drawFrame, 1000 / EXPORT_FPS);

      const videoBlob = await blobPromise;
      stream.getTracks().forEach((track) => track.stop());
      setGenerationProgress(98);

      const fileExtension = supportedMime.includes('mp4') ? 'mp4' : 'webm';
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${sanitizedName}.${fileExtension}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setGenerationProgress(100);

      if (fileExtension === 'mp4') {
        setStatus(`Screensaver video downloaded (MP4, ${exportSeconds}s, loop-ready)`);
      } else {
        setStatus(`Screensaver video downloaded (WebM, ${exportSeconds}s). For widest USB monitor support, generate with a browser that supports MP4 export.`);
      }
      generationSucceeded = true;
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to generate screensaver video');
    } finally {
      setIsGenerating(false);
      if (!generationSucceeded) {
        setGenerationProgress(0);
      }
    }
  };

  return (
    <div className="h-screen w-screen bg-surface text-on-surface overflow-hidden flex flex-col">
      {/* Header */}
      <header className="h-14 sm:h-16 bg-surface-lowest border-b border-outline-variant flex items-center px-4 sm:px-8 z-50 shrink-0">
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">GeekSaver</h1>
        <p className="hidden sm:block text-xs text-on-surface-variant ml-2 uppercase tracking-widest">DVD Screensaver Studio</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-96 lg:shrink-0 bg-surface-low border-b lg:border-b-0 lg:border-r border-outline-variant overflow-y-visible lg:overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
          {/* Upload Section */}
          <div>
            <SectionTitle>Upload Image</SectionTitle>
            <UploadArea
              image={image}
              onUpload={handleImageUpload}
              fileInputRef={fileInputRef}
              onFileInput={handleFileInput}
            />
          </div>

          {/* Animation Settings */}
          <div>
            <SectionTitle>Animation</SectionTitle>
            <AnimationSettings
              image={image}
              setImage={setImage}
              isPreviewActive={isPreviewActive}
              setIsPreviewActive={setIsPreviewActive}
              resolution={resolution}
              setResolution={setResolution}
              speed={speed}
              setSpeed={setSpeed}
              setStatus={setStatus}
            />
          </div>

          {/* Export Section */}
          <div>
            <SectionTitle>Generate</SectionTitle>
            <ExportSection
              image={image}
              fileName={fileName}
              setFileName={setFileName}
              isGenerating={isGenerating}
              generationProgress={generationProgress}
              onDownload={handleGenerateAndDownload}
            />
          </div>

          {/* Status */}
          <StatusDisplay status={status} />
        </div>

        {/* Right Panel - Canvas Preview */}
        <CanvasPreview
          image={image}
          canvasRef={animatedCanvasRef}
          isPreviewActive={isPreviewActive}
          speed={speed}
          resolution={resolution}
        />
      </main>
    </div>
  );
}
