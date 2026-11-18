import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { app } from '../src/app.js';

// Instantiates the actual Express app on an ephemeral local port.
test('API returns health and a deterministic demo score', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server,'listening');
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${base}/api/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).mode, 'synthetic-demo');

    const risk = await fetch(`${base}/api/risk/analyze`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({transaction:{amount:80000,velocity:5,international:true}}),
    });
    assert.equal(risk.status,200);
    const result = await risk.json();
    assert.equal(result.analysis.level,'high');
    assert.match(result.disclaimer,/demo score/i);

    const bad = await fetch(`${base}/api/risk/analyze`, {
      method:'POST',headers:{'Content-Type':'application/json'},
      body: JSON.stringify({transaction:{amount:-1}}),
    });
    assert.equal(bad.status,400);
  } finally {
    await new Promise(resolve=>server.close(resolve));
  }
});