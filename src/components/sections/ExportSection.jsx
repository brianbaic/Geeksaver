export default function ExportSection({
  image,
  fileName,
  setFileName,
  isGenerating,
  generationProgress,
  onDownload,
}) {
  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold uppercase text-on-surface-variant mb-2">
          File Name
        </label>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          placeholder="geeksaver-screensaver"
          className="w-full px-3 py-2 bg-surface-lowest border-none rounded-lg text-on-surface text-sm focus:outline-2 focus:outline-primary"
        />
        <p className="text-xs text-outline-variant mt-2 uppercase tracking-wider">
          Loop-ready video export (MP4 preferred)
        </p>
        <p className="text-xs text-outline-variant mt-1 uppercase tracking-wider">
          For widest USB monitor support, use MP4 output
        </p>
      </div>

      <button
        onClick={onDownload}
        disabled={!image || isGenerating}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-sm uppercase transition-all border ${
          image && !isGenerating
            ? 'border-secondary text-secondary hover:bg-secondary/10'
            : 'border-secondary/50 text-secondary/50 cursor-not-allowed'
        }`}
      >
        {isGenerating ? 'Generating Video...' : '⬇ Generate & Download Screensaver'}
      </button>

      {(isGenerating || generationProgress === 100) && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-on-surface-variant mb-2">
            <span>Generation Progress</span>
            <span>{generationProgress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-surface-lowest border border-outline-variant overflow-hidden">
            <div
              className="h-full bg-secondary transition-all duration-200"
              style={{ width: `${generationProgress}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}
