const rules = [
  { check: 'IP Risk', condition: 'fraud_score > 75 or proxy detected', deduction: 20 },
  { check: 'WebRTC Leak', condition: 'candidate IP differs from remote', deduction: 25 },
  { check: 'Timezone', condition: 'IP timezone mismatches system', deduction: 15 },
  { check: 'OS Consistency', condition: 'UA OS ≠ TCP/WebGL OS', deduction: 15 },
  { check: 'Language', condition: 'IP country not in Accept-Language', deduction: 5 },
  { check: 'Open Ports', condition: 'Critical ports (22/3389) exposed', deduction: 10 },
  { check: 'Bot Check', condition: 'webdriver/headless markers', deduction: 30 }
];

export default function MethodologyPage() {
  return (
    <article className="prose prose-invert mx-auto max-w-4xl px-4 py-10">
      <h1>Scoring Methodology</h1>
      <p>
        BrowserScan Authority Score begins at 100 and applies deterministic deductions based on layered telemetry (network, fingerprint, behavior). The table below mirrors the JSON schema returned by the Worker API.
      </p>
      <table>
        <thead>
          <tr>
            <th>Check</th>
            <th>Condition</th>
            <th>Deduction</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.check}>
              <td>{rule.check}</td>
              <td>{rule.condition}</td>
              <td>-{rule.deduction}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Data Flow</h2>
      <p>
        1) Cloudflare Worker enriches requests with cf data, 2) Client uploads fingerprint payload, 3) Worker persists to D1 / emits PDF job in R2, 4) Frontend consumes JSON schema for dashboards.
      </p>
    </article>
  );
}
