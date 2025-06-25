export function NeoBtn({
  as = "button",
  onClick,
  children,
  className,
  ...delegated
}) {
  const Component = as;

  return (
    <Component
      onClick={onClick}
      className="rounded-md cursor-pointer"
      {...delegated}
    >
      <span
        className={`${className} flex flex-col shadow-solid justify-center items-center gap-1 rounded-md border-2 border-black p-2 transition-all`}
      >
        {children}
      </span>
    </Component>
  );
}
