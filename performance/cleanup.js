import http from 'k6/http';
import { check } from 'k6';
import { lab07RunId, lab07Target } from './target.js';

const target = lab07Target({ write: true });
if (!target.preview) {
  throw new Error('Cleanup may target the protected Preview branch only.');
}
const runId = lab07RunId(target);

export const options = {
  vus: 1,
  iterations: 1,
  thresholds: { checks: ['rate==1'] },
};

export default function () {
  const response = http.post(
    `${target.baseUrl}/api/lab-07/evaluation-drafts/cleanup`,
    JSON.stringify({ runId }),
    { headers: { ...target.headers, 'Content-Type': 'application/json' } },
  );
  const ok = check(response, { 'cleanup status 200': (r) => r.status === 200 });
  if (ok) {
    console.log(`Lab 07 cleanup runId=${runId}; deletedCount=${response.json('deletedCount')}`);
  }
}
