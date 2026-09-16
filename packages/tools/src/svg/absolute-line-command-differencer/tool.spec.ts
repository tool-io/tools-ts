import { describe, it, expect } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
const expected = {
  result: {
    relativeCommands: [
      { command: "m", x: 1, y: 2 },
      { command: "l", x: 3, y: 4 },
    ],
  },
};
describe(tool.id, () => {
  it("computes independently specified fixture", () =>
    expect(calculate(example.input)).toEqual(expected));
  it("executes the fixture", () =>
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: expected,
    }));
  it("has a valid contract", () =>
    expect(validateToolContract(tool)).toEqual([]));
  it("has matching input and output schemas", () => {
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(expected, tool.outputSchema)).toBe(true);
  });
  it("requires own fields and rejects extras", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null fields", () => {
    for (const k of Object.keys(example.input))
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
  });
  it("rejects mismatched types", () => {
    for (const [k, v] of Object.entries(example.input))
      expect(
        tool.execute({
          ...example.input,
          [k]: typeof v === "string" ? 1 : typeof v === "number" ? "1" : null,
        }),
      ).toMatchObject({ ok: false });
  });
  it("rejects nonfinite and sparse numeric evidence", () => {
    for (const [k, v] of Object.entries(example.input)) {
      if (typeof v === "number")
        for (const bad of [NaN, Infinity, -Infinity])
          expect(() =>
            calculate({ ...example.input, [k]: bad } as Input),
          ).toThrow();
      if (Array.isArray(v)) {
        expect(() =>
          calculate({ ...example.input, [k]: Array(1) } as Input),
        ).toThrow();
        if (typeof v[0] === "number")
          expect(() =>
            calculate({ ...example.input, [k]: [NaN] } as Input),
          ).toThrow();
      }
    }
  });
  it("does not mutate callers", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    calculate(x);
    expect(JSON.stringify(x)).toBe(before);
    expect(calculate(x)).toEqual(calculate(x));
  });
  it("publishes a truthful example", () =>
    expect(example.output).toEqual(expected));
  it("enforces text and collection budgets", () => {
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
  it("rejects invalid domain evidence", () => {
    const x = {
      ...example.input,
      ...{ commandsJson: '[{"command":"Z","x":0,"y":0}]' },
    } as unknown as Input;
    expect(() => calculate(x)).toThrow();
    expect(tool.execute(x)).toMatchObject({ ok: false });
  });
});

// Batch 54 domain regressions
it("rejects nonfinite JSON evidence even when grouping could hide it", () => {
  const x = { commandsJson: "[null,1e999]" } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
});
it("rejects excessive JSON evidence nesting", () => {
  const x = { commandsJson: "[[[[[[[[[[[[[[[[[[0]]]]]]]]]]]]]]]]]]" } as Input;
  expect(() => calculate(x)).toThrow();
  expect(tool.execute(x)).toMatchObject({ ok: false });
});
it("covers an independently specified boundary", () => {
  expect(
    calculate({
      commandsJson:
        '[{"command":"M","x":2,"y":3},{"command":"M","x":-1,"y":0},{"command":"L","x":0,"y":0}]',
    } as Input),
  ).toEqual({
    result: {
      relativeCommands: [
        { command: "m", x: 2, y: 3 },
        { command: "m", x: -3, y: -3 },
        { command: "l", x: 1, y: 0 },
      ],
    },
  });
});
