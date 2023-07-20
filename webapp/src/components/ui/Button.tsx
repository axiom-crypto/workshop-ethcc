interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button(props: ButtonProps) {
  const { disabled, onClick, children } = props;

  if (disabled) {
    return (
      <button
        disabled={true}
        className="px-4 py-2 bg-container-main text-darkline rounded-md cursor-not-allowed"
      >
        { children }
      </button>
    )
  }
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-buttonbg text-white rounded-md hover:bg-buttonbg-hover duration-100 cursor-pointer"
    >
      { children }
    </button>
  )
}