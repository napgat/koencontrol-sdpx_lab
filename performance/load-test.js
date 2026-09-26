import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';
import { lab07RunId, lab07Target } from './target.js';

const errors = new Rate('errors');
const draftLatency = new Trend('draft_latency', true);

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 10 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1'],
    http_req_failed: ['rate<0.01'],
    errors: ['rate<0.05'],
    draft_latency: ['p(95)<300'],
    'http_req_duration{name:list}': ['p(95)<300'],
    'http_req_duration{name:detail}': ['p(95)<300'],
  },
};

const target = lab07Target({ write: true });
const baseUrl = target.baseUrl;
const runId = lab07RunId(target);

export function setup() {
  console.log(`Lab 07 load target: ${baseUrl}; max 10 VUs for 2m; runId: ${runId}`);
}

function jsonOrNull(response) {
  try {
    return response.json();
  } catch {
    return null;
  }
}

export default function () {
  let assignment;
  let pair;

  group('Browse and select', () => {
    const listResponse = http.get(`${baseUrl}/api/lab-07/assignments`, {
      headers: target.headers,
      tags: { name: 'list' },
    });
    const list = jsonOrNull(listResponse);

    check(listResponse, {
      'list status 200': (r) => r.status === 200,
      'list has items': () => Array.isArray(list) && list.length > 0,
    });

    if (
      listResponse.status !== 200 ||
      !Array.isArray(list) ||
      typeof list[0]?.id !== 'string'
    ) {
      return;
    }

    sleep(1);

    const detailResponse = http.get(
      `${baseUrl}/api/lab-07/assignments/${encodeURIComponent(list[0].id)}`,
      { headers: target.headers, tags: { name: 'detail' } },
    );
    const detail = jsonOrNull(detailResponse);

    check(detailResponse, {
      'detail status 200': (r) => r.status === 200,
      'detail has pairs': () =>
        Array.isArray(detail?.pairs) && detail.pairs.length > 0,
    });

    if (
      detailResponse.status === 200 &&
      typeof detail?.id === 'string' &&
      Array.isArray(detail.pairs) &&
      typeof detail.pairs[0]?.id === 'string'
    ) {
      assignment = detail;
      pair = detail.pairs[0];
    }

    sleep(1);
  });

  if (!assignment || !pair) {
    errors.add(true);
    return;
  }

  group('Create draft', () => {
    const createResponse = http.post(
      `${baseUrl}/api/lab-07/evaluation-drafts`,
      JSON.stringify({
        assignmentId: assignment.id,
        pairId: pair.id,
        choice: 'A',
        runId,
      }),
      {
        headers: { ...target.headers, 'Content-Type': 'application/json' },
        tags: { name: 'create' },
      },
    );

    draftLatency.add(createResponse.timings.duration);
    const created = jsonOrNull(createResponse);
    const createdOk =
      createResponse.status === 201 && typeof created?.id === 'string';

    check(createResponse, {
      'draft status 201': (r) => r.status === 201,
      'draft has id': () => typeof created?.id === 'string',
    });
    errors.add(!createdOk);
    sleep(2);
  });
}
