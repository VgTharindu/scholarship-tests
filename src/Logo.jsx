// QUIZ MASTER 5 logo: උපාධි තොප්පිය පැළඳි තැඹිලි "5" සහ ✓ ලකුණක් සහිත උත්තර කවය
export default function Logo({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      role="img"
      aria-label="QUIZ MASTER 5 logo"
    >
      {/* "5" ඉලක්කම: පළල නිල් ඉරක් උඩින් සිහින් තැඹිලි ඉරක් ඇඳලා outline එක හදනවා */}
      <path
        d="M78 52H47l-3 22c7-5 16-6 24-3 12 4 15 16 11 26-5 12-21 15-34 8"
        fill="none"
        stroke="#1A4BAE"
        strokeWidth="22"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M78 52H47l-3 22c7-5 16-6 24-3 12 4 15 16 11 26-5 12-21 15-34 8"
        fill="none"
        stroke="#F7931E"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* උපාධි තොප්පිය */}
      <path d="M36 34v10c0 5 11 9 24 9s24-4 24-9V34z" fill="#123A8C" />
      <path d="M60 10l50 19-50 19-50-19z" fill="#1A4BAE" />
      <path d="M60 29l40 6v22" fill="none" stroke="#F7931E" strokeWidth="3" strokeLinecap="round" />
      <path d="M96 56h8l2 12h-12z" fill="#F7931E" />
      {/* ✓ ලකුණ සහිත උත්තර කවය */}
      <circle cx="96" cy="96" r="15" fill="#fff" stroke="#1A4BAE" strokeWidth="4" />
      <path
        d="M89 96l5 5 9-10"
        fill="none"
        stroke="#F7931E"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
