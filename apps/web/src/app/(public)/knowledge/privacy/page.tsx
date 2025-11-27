export default function PrivacyPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-4xl px-4 py-10">
      <h1>Privacy Whitepaper</h1>
      <p>
        BrowserScan stores anonymized scan blobs for 30 days inside Cloudflare D1. IP addresses are hashed with rotating salts, and WebRTC/DNS data is trimmed before archival. PDF exports are saved in R2 with seven-day lifecycle rules.
      </p>
      <h2>Data Retention</h2>
      <ul>
        <li>Scan metadata: 30 days</li>
        <li>PDF artifacts: 7 days</li>
        <li>Simulation logs: 24 hours</li>
      </ul>
      <h2>Compliance</h2>
      <p>Turnstile tokens are verified server-side only. No third-party trackers are embedded.</p>
    </article>
  );
}
