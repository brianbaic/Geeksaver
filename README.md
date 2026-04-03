# GeekSaver - DVD Logo Bounce Recorder

A web-based application for recording DVD-style bouncing logo animations and downloading them as WebM videos.

## Features

- **Image Upload**: Drag-and-drop or select PNG, JPEG, WebP, or GIF images
- **Animation Preview**: See your logo bounce with hue-rotation effects in real-time
- **Customizable Settings**: 
  - Resolution presets (720p, 1080p, 1440p)
  - Playback speed (0.5x to 2.5x)
  - Recording duration (1-300 seconds)
- **Video Recording**: Capture to WebM format (VP8 + Opus codecs)
- **Browser Download**: Save recorded videos directly to your computer

## Running Locally

### Quick Start
```bash
npx http-server -p 3000
```

Then open `http://localhost:3000` in your browser.

### With Node.js installed
```bash
npm start
```

## Deploying to Vercel

This project is ready to deploy to Vercel as a static site:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it as a static site
3. Deploy with zero configuration

No build step required—the app runs entirely in the browser.

## Usage

1. **Upload an image** by dragging it onto the upload area or clicking to select
2. **Configure animation settings**:
   - Choose output resolution
   - Adjust playback speed if desired
3. **Start Preview** to see the animation
4. **Set recording duration** and click **Start Recording**
5. **Download** the recorded video to your computer
6. (Optional) Copy the downloaded file to a USB drive

## Technical Details

- Pure JavaScript (no frameworks)
- Canvas API for rendering
- MediaRecorder API for video capture
- WebM video format (VP8 + Opus codecs)
- No server-side processing required
- All processing happens in your browser

## Browser Support

Works in all modern browsers that support:
- Canvas 2D Context
- MediaRecorder API
- URL.createObjectURL()

Tested on:
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14.1+
- Edge 90+

## License

MIT
