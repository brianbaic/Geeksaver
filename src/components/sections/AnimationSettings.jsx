export default function AnimationSettings({
  image,
  setImage,
  isPreviewActive,
  setIsPreviewActive,
  resolution,
  setResolution,
  speed,
  setSpeed,
  setStatus,
}) {
  const handleStartPreview = () => {
    if (!image) {
      setStatus('Please upload an image first');
      return;
    }
    setIsPreviewActive(true);
    setStatus('Preview started');
  };

  const handleStopPreview = () => {
    setIsPreviewActive(false);
    setStatus('Preview stopped');
  };

  const handleClearPreview = () => {
    setIsPreviewActive(false);
    setImage(null);
    setStatus('Preview cleared');
  };

  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">
          Output Resolution
        </label>
        <select
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          className="w-full px-3 py-2 bg-surface-lowest border-none rounded-lg text-on-surface text-sm focus:outline-2 focus:outline-primary"
        >
          <option value="720p">720p (1280x720)</option>
          <option value="1080p">1080p (1920x1080)</option>
          <option value="1440p">1440p (2560x1440)</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">
          Playback Speed: <span className="text-on-surface">{speed.toFixed(1)}x</span>
        </label>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="w-full h-1 bg-surface-lowest rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-outline-variant font-mono mt-2">
          <span>0.5x</span>
          <span>1.0x</span>
          <span>1.5x</span>
          <span>2.0x</span>
          <span>2.5x</span>
        </div>
      </div>

      <button
        onClick={isPreviewActive ? handleStopPreview : handleStartPreview}
        disabled={!image}
        className={`w-full py-3 rounded-lg font-semibold text-sm uppercase transition-all ${
          image
            ? isPreviewActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-primary hover:bg-blue-700 text-white'
            : 'bg-primary/50 text-white cursor-not-allowed'
        }`}
      >
        {isPreviewActive ? '⏹ Stop Preview' : '▶ Start Preview'}
      </button>

      <button
        onClick={handleClearPreview}
        disabled={!image}
        className={`w-full py-3 mt-2 rounded-lg font-semibold text-sm uppercase transition-all ${
          image
            ? 'bg-gray-600 hover:bg-gray-700 text-white'
            : 'bg-gray-600/50 text-white cursor-not-allowed'
        }`}
      >
        ✕ Clear Preview
      </button>
    </>
  );
}
