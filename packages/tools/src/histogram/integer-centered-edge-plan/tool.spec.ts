import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
import * as helpers from "../batch56-shared.js";
it("samples large exact integer support without converting it to an unsafe number", () => {
  expect(helpers.randomBig((1n << 100n) + 1n, () => 0)).toBe(0n);
  let calls = 0;
  expect(() =>
    helpers.randomBig((1n << 60n) + 1n, () => {
      calls++;
      return 0.999999;
    }),
  ).toThrow();
  expect(calls).toBe(61 * 128);
});
it("rejects empty or oversized exact support immediately", () => {
  for (const limit of [0n, -1n, 1n << 256n])
    expect(() => helpers.randomBig(limit, () => 0)).toThrow();
});
it("preserves one advancing seeded source and never accepts invalid source values", () => {
  const a = helpers.randomSource("same"),
    b = helpers.randomSource("same");
  expect(Array.from({ length: 32 }, () => a())).toEqual(
    Array.from({ length: 32 }, () => b()),
  );
  for (const value of [NaN, Infinity, -0.1, 1])
    expect(() => helpers.randomBig(7n, () => value)).toThrow();
});
it("rejects impossible finite composition counts without unbounded retries", () => {
  expect(helpers.chunkCounts(1, 3, 1, 3).total).toBe(0n);
  expect(helpers.chunkCounts(0, 0, 1, 3).total).toBe(1n);
});
const expected = { result: { edges: [-1.5, -0.5, 0.5, 1.5, 2.5] } };
const close = (a: unknown, b: unknown): void => {
  if (typeof b === "number") {
    expect(typeof a).toBe("number");
    expect(Math.abs((a as number) - b)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(b)) * 1e-10,
    );
  } else if (Array.isArray(b)) {
    expect(Array.isArray(a)).toBe(true);
    expect((a as unknown[]).length).toBe(b.length);
    b.forEach((v, j) => close((a as unknown[])[j], v));
  } else if (b && typeof b === "object") {
    expect(a !== null && typeof a === "object").toBe(true);
    expect(Object.keys(a as object).sort()).toEqual(Object.keys(b).sort());
    for (const [k, v] of Object.entries(b))
      close((a as Record<string, unknown>)[k], v);
  } else expect(a).toEqual(b);
};
describe(tool.id, () => {
  it("matches an independent domain fixture", () =>
    close(calculate(example.input), expected));
  it("executes the declared fixture", () => {
    const r = tool.execute(example.input);
    expect(r.ok).toBe(true);
    if (r.ok) close(r.output, expected);
  });
  it("publishes valid contract and schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects wrong field types", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(
        tool.execute({
          ...example.input,
          [k]: typeof v === "string" ? 1 : "bad",
        }),
      ).toMatchObject({ ok: false });
    }
  });
  it("rejects nonfinite or sparse evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
    }
  });
  it("bounds text and arrays", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "string")
        expect(() =>
          calculate({ ...example.input, [k]: "x".repeat(8193) } as Input),
        ).toThrow();
      if (Array.isArray(v))
        expect(() =>
          calculate({ ...example.input, [k]: Array(129).fill(v[0]) } as Input),
        ).toThrow();
    }
  });
  it("is reproducible and does not mutate inputs", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      s = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(s);
  });
});

// Batch 56 domain regressions
it("handles independent edge-case evidence", () => {
  close(calculate({ first: 0, last: 0 } as Input), {
    result: { edges: [-0.5, 0.5] },
  });
}, 30000);
it("rejects unsupported boundary evidence", () => {
  const x = { first: 2, last: 1 } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
}, 30000);
