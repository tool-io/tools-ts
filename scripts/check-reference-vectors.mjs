import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { root, packageRoot } from "./package-build.mjs";
import { loadTool } from "../packages/tools/dist/registry.js";

// Expected values below come from standards, elementary constructions, or
// Node's OpenSSL-backed implementation, never from authored tool examples.
const tools = new Map();
let cases = 0;
const run = async (id, input) => {
  if (!tools.has(id)) tools.set(id, await loadTool(id));
  assert.ok(tools.get(id), id);
  cases++;
  return tools.get(id).execute(input);
};
const output = async (id, input) => {
  const result = await run(id, input);
  assert.equal(result.ok, true, `${id}: ${JSON.stringify(result)}`);
  return result.output;
};
const close = (actual, expected) =>
  assert.ok(
    Math.abs(actual - expected) <= 1e-12 * Math.max(1, Math.abs(expected)),
    `${actual} != ${expected}`,
  );

// RFC 4648 section 10. No RFC implementation code is copied.
for (const [text, base64] of [
  ["", ""],
  ["f", "Zg=="],
  ["fo", "Zm8="],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg=="],
  ["fooba", "Zm9vYmE="],
  ["foobar", "Zm9vYmFy"],
]) {
  assert.deepEqual(await output("encode/base64", { text }), { base64 });
  assert.deepEqual(await output("decode/base64", { base64 }), { text });
}
for (const base64 of ["=", "A", "!!!!", "Zg==="])
  assert.equal((await run("decode/base64", { base64 })).ok, false);
for (const text of ["猫😀", "a\u0000b", "\n\r\t"])
  assert.deepEqual(await output("encode/base64", { text }), {
    base64: Buffer.from(text).toString("base64"),
  });

// Independent crypto backend plus SHA block/padding boundaries and Unicode.
for (const bits of [1, 224, 256, 384, 512]) {
  const algorithm = `sha${bits}`;
  for (const text of [
    "",
    "abc",
    "猫😀",
    ...[55, 56, 63, 64, 65, 111, 112, 127, 128, 129].map((n) => "a".repeat(n)),
  ])
    assert.deepEqual(await output(`hash/sha-${bits}`, { text }), {
      digest: createHash(algorithm).update(text, "utf8").digest("hex"),
    });
}
assert.deepEqual(await output("hash/sha-256", { text: "abc" }), {
  digest: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
});
assert.deepEqual(await output("checksum/crc-32", { text: "123456789" }), {
  checksum: "CBF43926",
});

// Exhaustive small GCDs by divisor enumeration, not the Euclidean algorithm.
for (let a = -10; a <= 10; a++)
  for (let b = -10; b <= 10; b++) {
    let expected = 0;
    for (let d = 1; d <= Math.max(Math.abs(a), Math.abs(b)); d++)
      if (a % d === 0 && b % d === 0) expected = d;
    assert.deepEqual(
      await output("math/gcd-list", { values: [String(a), String(b)] }),
      { gcd: String(expected) },
    );
  }
assert.deepEqual(
  await output("math/gcd-list", {
    values: [
      "37000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "37",
    ],
  }),
  { gcd: "37" },
);

// Construct equations from known integer roots (Vieta), then check residuals.
for (let left = -5; left <= 5; left++)
  for (let right = left; right <= 5; right++) {
    for (const a of [-2, 1]) {
      const b = -a * (left + right),
        c = a * left * right;
      const result = await output("algebra/quadratic-equation", { a, b, c });
      assert.equal(
        result.case,
        left === right ? "double_root" : "two_real_roots",
      );
      const expected = left === right ? [left] : [left, right];
      assert.equal(result.roots.length, expected.length);
      result.roots.forEach((value, i) => {
        close(value, expected[i]);
        close(a * value * value + b * value + c, 0);
      });
    }
  }
const stable = await output("algebra/quadratic-equation", {
  a: 1,
  b: -100000000,
  c: 1,
});
assert.ok(stable.roots[0] > 0);
close(stable.roots[0] * stable.roots[1], 1);
assert.deepEqual(
  (await output("algebra/quadratic-equation", { a: 0, b: 2, c: -6 })).roots,
  [3],
);
assert.equal(
  (await output("algebra/quadratic-equation", { a: 1, b: 0, c: 1 })).case,
  "complex_roots",
);

for (const center of [0, -100, 1e9])
  for (const distance of [0, 1, 10]) {
    const values = [center - distance, center + distance];
    close(
      (await output("statistics/standard-deviation", { values }))
        .standardDeviation,
      distance,
    );
    close((await output("statistics/median", { values })).median, center);
  }
assert.deepEqual(
  await output("network/ipv4-cidr", { address: "192.0.2.129", prefix: 25 }),
  {
    networkAddress: "192.0.2.128",
    broadcastAddress: "192.0.2.255",
    firstHost: "192.0.2.129",
    lastHost: "192.0.2.254",
    totalHosts: 126,
  },
);
assert.equal(
  (await run("network/ipv4-cidr", { address: "999.0.0.1", prefix: 24 })).ok,
  false,
);
const pem = await output("security/pem-certificate-inspector", {
  pem: "-----BEGIN CERTIFICATE-----\nYWJj\n-----END CERTIFICATE-----",
});
assert.deepEqual(pem.decodedByteCounts, [3]);
assert.deepEqual(pem.labels, ["CERTIFICATE"]);
assert.equal(
  (
    await run("security/pem-certificate-inspector", {
      pem: "-----BEGIN CERTIFICATE-----\nYWJj\n-----END PUBLIC KEY-----",
    })
  ).ok,
  false,
);

const catalog = JSON.parse(
  await readFile(path.join(packageRoot, "catalog.generated.json"), "utf8"),
);
const withoutAdjacentSpec = [];
for (const entry of catalog.entries) {
  try {
    await access(path.join(packageRoot, "src", entry.id, "tool.spec.ts"));
  } catch {
    withoutAdjacentSpec.push(entry.id);
  }
}
const report = {
  schemaVersion: 1,
  node: process.version,
  openssl: process.versions.openssl,
  catalogFingerprint: catalog.catalogFingerprint,
  cases,
  independentlyExercisedTools: [...tools.keys()],
  inventory: {
    tools: catalog.entries.length,
    adjacentSpecs: catalog.entries.length - withoutAdjacentSpec.length,
    withoutAdjacentSpec,
  },
  references: [
    "https://www.rfc-editor.org/rfc/rfc4648.html#section-10",
    "https://www.rfc-editor.org/rfc/rfc6234.html",
    "https://nodejs.org/api/crypto.html#cryptocreatehashalgorithm-options",
    "https://www.rfc-editor.org/rfc/rfc1952.html",
  ],
  limitations:
    "Bounded release review, not certification of all domains. Missing adjacent specs may be covered by shared family suites; examples and round trips alone are not independent correctness evidence. PEM inspection is structural, not certificate authentication. SHA-1/CRC vectors do not endorse those algorithms for security.",
};
await mkdir(path.join(root, ".log"), { recursive: true });
await writeFile(
  path.join(root, ".log/reference-vectors.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    passed: true,
    cases,
    tools: tools.size,
    adjacentSpecs: report.inventory.adjacentSpecs,
    withoutAdjacentSpec: withoutAdjacentSpec.length,
  }),
);
