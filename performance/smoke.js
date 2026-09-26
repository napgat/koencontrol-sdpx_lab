import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

export default function () {
  const baseUrl = __ENV.BASE_URL || 'http://127.0.0.1:3000';
  const res = http.get(`${baseUrl}/api/health`);

  check(res, {
    'health status 200': (r) => r.status === 200,
    'health status ok': (r) => r.json('status') === 'ok',
  });

  sleep(1);
}