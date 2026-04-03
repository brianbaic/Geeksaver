export default function StatusDisplay({ status }) {
  return (
    <div className="bg-primary/10 border border-primary rounded-lg p-3 flex items-center gap-3 text-primary text-xs uppercase tracking-wider font-mono font-medium">
      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
      <span>{status}</span>
    </div>
  );
}
