const previewUrl =
  'https://koencontrol-sdpx-lab-git-codex-lab-07-performance-npaha.vercel.app';

export function lab07Target({ write = false } = {}) {
  const baseUrl = (__ENV.BASE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
  const local = /^http:\/\/(127\.0\.0\.1|localhost):3000$/.test(baseUrl);
  const preview = baseUrl === previewUrl;

  if (!local && !preview) {
    throw new Error('Lab 07 target must be local port 3000 or the protected Preview branch URL.');
  }

  const headers = {};
  if (preview) {
    if (!__ENV.VERCEL_AUTOMATION_BYPASS_SECRET) {
      throw new Error('Preview requires VERCEL_AUTOMATION_BYPASS_SECRET.');
    }
    headers['x-vercel-protection-bypass'] = __ENV.VERCEL_AUTOMATION_BYPASS_SECRET;

    if (write) {
      if (!__ENV.LAB07_WRITE_TOKEN) {
        throw new Error('Preview write requires LAB07_WRITE_TOKEN.');
      }
      headers['x-lab07-write-token'] = __ENV.LAB07_WRITE_TOKEN;
    }
  }

  return { baseUrl, local, preview, headers };
}

export function lab07RunId(target) {
  const runId = __ENV.RUN_ID || (target.local ? 'local-manual' : '');
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(runId)) {
    throw new Error('Set a unique RUN_ID using 1-64 letters, digits, _ or -.');
  }
  return runId;
}
