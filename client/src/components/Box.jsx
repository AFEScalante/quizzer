export default function Box({ children, className }) {
  return (
    <div
      className={`${className} shadow-solid-only flex justify-between items-center p-4 rounded-lg border border-black transition`}
    >
      {children}
    </div>
  );
}
