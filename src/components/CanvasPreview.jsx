export default function CanvasPreview({ image, canvasRef, isPreviewActive, speed, resolution }) {
  return (
    <div className="w-full flex-1 bg-black flex items-center justify-center relative overflow-hidden p-3 sm:p-4 lg:p-8 min-h-[320px] sm:min-h-[420px] lg:min-h-0">
      <div className="w-full aspect-video lg:aspect-auto lg:h-full bg-surface-high/50 backdrop-blur-lg rounded-2xl border border-white/5 flex items-center justify-center relative overflow-hidden">
        {/* Canvas - Only show if image is loaded */}
        {image && (
          <>
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full block"
              style={{ width: '100%', height: 'auto' }}
            />

            {/* Canvas Metadata */}
            <div className="absolute top-2 left-2 sm:top-5 sm:left-5 text-on-surface text-[10px] sm:text-xs font-mono space-y-2 sm:space-y-3 bg-surface-lowest/80 backdrop-blur px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg">
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider">Resolution</div>
                <div className="text-base font-bold">1920 x 1080</div>
              </div>
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider">Speed</div>
                <div className="text-base font-bold">{speed.toFixed(1)}x</div>
              </div>
              <div>
                <div className="text-xs font-bold text-primary uppercase tracking-wider">Target FPS</div>
                <div className="text-base font-bold">30</div>
              </div>
            </div>
          </>
        )}

        {/* Guide - Only show if no image */}
        {!image && (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full h-full p-4 sm:p-6 lg:p-8">
            {/* Preview Area */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl opacity-20 mb-4">🖼️</div>
              <h3 className="text-lg sm:text-xl font-bold mb-2">No Media Detected</h3>
              <p className="text-on-surface-variant text-sm">Upload an image to see preview</p>
            </div>

            {/* Guide */}
            <div className="flex-1 flex flex-col justify-center max-h-full overflow-y-auto">
              <h2 className="text-lg font-bold mb-6">How to Create Your Screensaver</h2>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Upload Image</h3>
                    <p className="text-xs text-on-surface-variant">
                      Choose a PNG, JPEG, WebP, or GIF. Transparent backgrounds work best!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Customize Settings</h3>
                    <p className="text-xs text-on-surface-variant">
                      Pick your resolution and speed. 0.5x is classic, 2.5x is chaos!
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">View Static Preview</h3>
                    <p className="text-xs text-on-surface-variant">
                      After upload, your image appears centered so you can verify framing.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">View Animated Preview</h3>
                    <p className="text-xs text-on-surface-variant">
                      Press "Start Preview" to run the endless bouncing DVD animation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white font-bold text-sm flex-shrink-0">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">Generate & Download</h3>
                    <p className="text-xs text-on-surface-variant">
                      Export a loop-ready video file for USB monitor playback.
                    </p>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-8 pt-6 border-t border-outline-variant">
                <h3 className="text-sm font-semibold mb-3">💡 Pro Tips</h3>
                <ul className="text-xs text-on-surface-variant space-y-2">
                  <li>• Use 1080p for best quality</li>
                  <li>• Slower speeds look more authentic</li>
                  <li>• The corner hit is random - enjoy the suspense!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
