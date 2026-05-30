interface FilterButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const FilterButton = ({
  label,
  isActive,
  onClick,
}: FilterButtonProps) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-medium transition ${
      isActive
        ? "bg-neutral-900 text-white"
        : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
    }`}
  >
    {label}
  </button>
);

export default FilterButton;
