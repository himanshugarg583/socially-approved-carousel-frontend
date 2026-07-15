export function Spinner({ hidden = false }) {
  return (
    <div className={`sa-spinner${hidden ? " is-hidden" : ""}`}>
      <span className="sa-ring" />
    </div>
  );
}
