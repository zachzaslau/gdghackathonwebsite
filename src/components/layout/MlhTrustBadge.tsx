/**
 * MLH's official trust badge, pinned to the top-right of the home menu. Markup
 * follows MLH's embed snippet, with two changes: the width comes from
 * --mlh-badge-w (index.css), which pages also use to keep clear of it, and the
 * z-index sits just under the Wii cursor (z-[9999]) so the cursor draws on top.
 */
export function MlhTrustBadge() {
  return (
    <a
      id="mlh-trust-badge"
      href="https://mlh.io/na?utm_source=na-hackathon&utm_medium=TrustBadge&utm_campaign=2026-season&utm_content=blue"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        position: 'fixed',
        right: 50,
        top: 0,
        width: 'var(--mlh-badge-w)',
        zIndex: 9998,
      }}
    >
      <img
        src="https://logged-assets.s3.amazonaws.com/trust-badge/2027/mlh-trust-badge-2027-blue.svg"
        alt="Major League Hacking 2026 Hackathon Season"
        style={{ width: '100%' }}
      />
    </a>
  )
}
