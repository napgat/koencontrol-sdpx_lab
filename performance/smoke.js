import http from 'k6/http';
import { check, sleep } from 'k6';
import { lab07Target } from './target.js';

export const options = {
  vus: 3,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const target = lab07Target();

export function setup() {
  console.log(`Lab 07 smoke target: ${target.baseUrl}; 3 VUs for 30s`);
}

export default function () {
  const res = http.get(`${target.baseUrl}/api/health`, {
    headers: target.headers,
  });

  check(res, {
    'health status 200': (r) => r.status === 200,
    'health status ok': (r) => r.json('status') === 'ok',
  });

  sleep(1);
}
