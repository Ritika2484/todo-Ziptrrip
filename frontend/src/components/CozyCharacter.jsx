/**
 * CozyCharacter — An interactive character (orange tabby cat) that reacts
 * to task completion states with custom speech bubbles and animated SVG paths.
 *
 * State 1: All clear (0 active tasks) — Cat waves its paw happily.
 * State 2: Active tasks pending — Cat sits idle / rests cozy with a wiggling tail.
 *
 * @param {{ activeCount: number, totalCount: number }} props
 */
export default function CozyCharacter({ activeCount, totalCount }) {
  const isAllClear = totalCount === 0 || activeCount === 0;

  return (
    <div className="cozy-char-container" aria-live="polite">
      {isAllClear ? (
        /* Waving Cat (All Clear) */
        <svg
          viewBox="0 0 100 100"
          className="cozy-cat"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="50" cy="85" rx="30" ry="8" fill="#E6DFD3" opacity="0.6" />

          {/* Tail */}
          <path
            d="M 68 75 Q 85 70 82 45 Q 80 35 72 38"
            fill="none"
            stroke="#E8916A"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 68 75 Q 85 70 82 45 Q 80 35 72 38"
            fill="none"
            stroke="#F0A37E"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Body */}
          <ellipse cx="50" cy="62" rx="22" ry="24" fill="#E8916A" />
          <ellipse cx="50" cy="62" rx="16" ry="18" fill="#F0A37E" />
          {/* Stripes */}
          <path d="M 28 62 L 36 62" stroke="#D37E56" strokeWidth="3" strokeLinecap="round" />
          <path d="M 72 62 L 64 62" stroke="#D37E56" strokeWidth="3" strokeLinecap="round" />

          {/* Feet */}
          <circle cx="40" cy="81" r="6" fill="#F0A37E" />
          <circle cx="60" cy="81" r="6" fill="#F0A37E" />

          {/* Left Paw (Static) */}
          <rect x="52" y="68" width="10" height="8" rx="4" fill="#FAF5EC" />

          {/* Right Paw (Waving - Pivot at 20, 75) */}
          <g className="cat-waving-paw">
            <path
              d="M 20 75 Q 12 55 18 45"
              fill="none"
              stroke="#E8916A"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="18" cy="45" r="5" fill="#FAF5EC" />
          </g>

          {/* Head */}
          <circle cx="50" cy="36" r="18" fill="#E8916A" />

          {/* Ears */}
          <polygon points="34,26 30,12 44,22" fill="#E8916A" />
          <polygon points="36,24 33,15 42,21" fill="#F4BAB3" />
          <polygon points="66,26 70,12 56,22" fill="#E8916A" />
          <polygon points="64,24 67,15 58,21" fill="#F4BAB3" />

          {/* Cheeks */}
          <ellipse cx="40" cy="41" rx="4" ry="2" fill="#F4BAB3" opacity="0.6" />
          <ellipse cx="60" cy="41" rx="4" ry="2" fill="#F4BAB3" opacity="0.6" />

          {/* Eyes (Happy arcs) */}
          <path d="M 38 35 Q 42 31 44 35" fill="none" stroke="#2C2417" strokeWidth="2" strokeLinecap="round" />
          <path d="M 56 35 Q 58 31 62 35" fill="none" stroke="#2C2417" strokeWidth="2" strokeLinecap="round" />

          {/* Nose/Mouth */}
          <polygon points="50,39 48,37 52,37" fill="#2C2417" />
          <path d="M 47 41 Q 50 43 50 41 Q 50 43 53 41" fill="none" stroke="#2C2417" strokeWidth="1.5" strokeLinecap="round" />

          {/* Whiskers */}
          <path d="M 28 39 L 18 37" stroke="#2C2417" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <path d="M 28 42 L 17 42" stroke="#2C2417" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <path d="M 72 39 L 82 37" stroke="#2C2417" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <path d="M 72 42 L 83 42" stroke="#2C2417" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        </svg>
      ) : (
        /* Sleeping / Idle Cat (Active Tasks) */
        <svg
          viewBox="0 0 100 100"
          className="cozy-cat"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow */}
          <ellipse cx="50" cy="85" rx="36" ry="8" fill="#E6DFD3" opacity="0.6" />

          {/* Tail (Wiggling - Pivot at 75, 65) */}
          <g className="cat-wiggle-tail">
            <path
              d="M 75 65 Q 92 60 88 40 Q 86 32 78 34"
              fill="none"
              stroke="#E8916A"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 75 65 Q 92 60 88 40 Q 86 32 78 34"
              fill="none"
              stroke="#F0A37E"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </g>

          {/* Curled Body */}
          <ellipse cx="52" cy="65" rx="30" ry="20" fill="#E8916A" />
          {/* Body Stripes */}
          <path d="M 52 45 Q 50 52 46 54" stroke="#D37E56" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 64 47 Q 61 54 57 56" stroke="#D37E56" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M 40 50 Q 38 56 34 58" stroke="#D37E56" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Head (Sleeping) */}
          <circle cx="34" cy="58" r="14" fill="#E8916A" />
          <circle cx="34" cy="58" r="10" fill="#F0A37E" />

          {/* Ears */}
          <polygon points="22,50 16,38 28,45" fill="#E8916A" />
          <polygon points="23,49 19,41 27,45" fill="#F4BAB3" />
          <polygon points="44,50 48,38 38,45" fill="#E8916A" />

          {/* Closed Sleeping Eyes */}
          <path d="M 24 58 Q 27 61 30 58" fill="none" stroke="#2C2417" strokeWidth="2" strokeLinecap="round" />
          <path d="M 38 58 Q 41 61 44 58" fill="none" stroke="#2C2417" strokeWidth="2" strokeLinecap="round" />

          {/* Whiskers */}
          <path d="M 22 62 L 14 63" stroke="#2C2417" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <path d="M 22 65 L 15 67" stroke="#2C2417" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
        </svg>
      )}

      {/* Speech Bubble */}
      <div className="cozy-char-bubble">
        {isAllClear ? (
          <span>Hooray! All done! Time to relax. 🍵</span>
        ) : (
          <span>
            {activeCount} active task{activeCount !== 1 ? 's' : ''} left. Let's do this! ☕
          </span>
        )}
      </div>
    </div>
  );
}
