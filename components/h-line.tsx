import clsx from "clsx";

/** Full-width horizontal border that extends beyond the container to screen edges */
export function HLine({ className }: { className?: string }) {
  return (
    <div className={clsx("relative", className)}>
      <div
        className="pointer-events-none absolute left-0 h-0 border-t border-brand-3"
        style={{ width: 4000, marginLeft: -2000 }}
      />
    </div>
  );
}
