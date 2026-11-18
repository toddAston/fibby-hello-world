const assert = require("node:assert/strict");
const test = require("node:test");

test("a fetch event receives the worker's greeting as plain text", async () => {
  let onFetch;
  globalThis.addEventListener = (eventName, listener) => {
    assert.equal(eventName, "fetch");
    onFetch = listener;
  };
  try {
    require("../index.js");
  } finally {
    delete globalThis.addEventListener;
  }
  let responsePromise;
  onFetch({
    request: new Request("https://example.invalid/"),
    respondWith(response) {
      responsePromise = response;
    },
  });
  const response = await responsePromise;
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/plain");
  assert.equal(await response.text(), "Hello worker!");
});
