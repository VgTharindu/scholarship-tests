// QUIZ MASTER 5 logo: නිල් කොටුවක් ඇතුළේ "5" ඉලක්කම සහ පාට කළ උත්තර කවයක්
export default function Logo({ size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="QUIZ MASTER 5 logo"
    >
      <rect x="2" y="2" width="60" height="60" rx="16" fill="#1B2A6B" />
      <path
        d="M41 15H24l-2 15c4-3 9-4 13-3 8 2 10 9 8 15-2 7-11 10-19 6"
        fill="none"
        stroke="#fff"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="49" cy="49" r="11" fill="#F5B700" stroke="#1B2A6B" strokeWidth="3" />
      <path
        d="M44 49l4 4 7-8"
        fill="none"
        stroke="#D7263D"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
