import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: {
    table: [
      [0, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ],
  },
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
  it("rejects malformed/deep/nonfinite JSON ballotsJson", () => {
    for (const s of ["{", "[1e999]", "[".repeat(18) + "0" + "]".repeat(18)])
      expect(() =>
        calculate({ ...example.input, ballotsJson: s } as Input),
      ).toThrow();
  });
});

// Batch 56 domain regressions
it("rejects inherited array entries as explicit evidence", () => {
  for (const [k, v] of Object.entries(example.input))
    if (Array.isArray(v)) {
      const a = Array(1);
      Object.setPrototypeOf(
        a,
        Object.assign(Object.create(Array.prototype), { 0: v[0] }),
      );
      expect(() => calculate({ ...example.input, [k]: a } as Input)).toThrow();
    }
}, 30000);
it("rejects unsupported boundary evidence", () => {
  const x = {
    candidates: ["a", "b", "c"],
    ballotsJson: '[["a","a"]]',
  } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
}, 30000);
it("handles independent edge-case evidence", () => {
  close(
    calculate({
      candidates: ["a", "b", "c"],
      ballotsJson: '[["a"],["b"]]',
    } as Input),
    {
      result: {
        table: [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
      },
    },
  );
}, 30000);
it("pairwise table transposes correctly under reversed full rankings", () => {
  for (const ballots of [
    [["a", "b", "c"]],
    [
      ["a", "b", "c"],
      ["b", "c", "a"],
    ],
  ]) {
    const candidates = ["a", "b", "c"],
      a = calculate({ candidates, ballotsJson: JSON.stringify(ballots) }).result
        .table as number[][],
      b = calculate({
        candidates,
        ballotsJson: JSON.stringify(ballots.map((v) => [...v].reverse())),
      }).result.table as number[][];
    for (let j = 0; j < 3; j++)
      for (let k = 0; k < 3; k++) expect(a[j][k]).toBe(b[k][j]);
  }
}, 30000);
