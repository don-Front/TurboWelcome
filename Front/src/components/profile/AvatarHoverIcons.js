const iconProps = {
  className: undefined,
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true,
};

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function UploadIcon({ className }) {
  return (
    <svg {...iconProps} className={className}>
      <path d="M12 4.5v9" {...stroke} />
      <path d="M8.5 10.5 12 14l3.5-3.5" {...stroke} />
      <path d="M5 15v3.5A2.5 2.5 0 0 0 7.5 20.5h9A2.5 2.5 0 0 0 19 18.5V15" {...stroke} />
    </svg>
  );
}

export default UploadIcon;
