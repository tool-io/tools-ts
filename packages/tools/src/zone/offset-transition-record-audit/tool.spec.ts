import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: { duplicateInstants: [], nonIncreasing: [], discontinuous: [] },
};
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
  it("rejects malformed/deep/nonfinite JSON transitionsJson", () => {
    for (const s of ["{", "[1e999]", "[".repeat(18) + "0" + "]".repeat(18)])
      expect(() =>
        calculate({ ...example.input, transitionsJson: s } as Input),
      ).toThrow();
  });
});

// Batch 56 domain regressions
it("handles independent edge-case evidence", () => {
  close(
    calculate({
      transitionsJson:
        '[{"at":2,"before":0,"after":1},{"at":2,"before":5,"after":0}]',
    } as Input),
    {
      result: {
        duplicateInstants: [{ key: "2", indexes: [0, 1] }],
        nonIncreasing: [1],
        discontinuous: [1],
      },
    },
  );
}, 30000);
