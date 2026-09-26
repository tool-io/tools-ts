import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("electricity/capacitor-series-voltage-share", () => {
  it("publishes a valid portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, outputSchema)).toBe(true);
  });
  it("reproduces its exact canonical example", () => {
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(calculate(example.input)).toEqual(example.output);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches an independent valid or boundary fixture", () => {
    expect(
      tool.execute({
        capacitances: [2, 4, 4],
        referenceIndex: 1,
        supplyVolts: 12,
      }),
    ).toEqual({
      ok: true,
      output: { voltageShare: 0.25, referenceVoltage: 3 },
    });
  });
  it.each([
    null,
    [],
    "invalid",
    {},
    { ...example.input, unexpected: 1 },
    ...Object.keys(example.input).map((key) => ({
      ...example.input,
      [key]: null,
    })),
  ])("rejects malformed or missing input %j", (input) => {
    const r = tool.execute(input);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe("invalid_input");
      expect(r.error.issues[0].code).toBe("invalid_field");
    }
  });
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceIndex",
    (value) =>
      expect(tool.execute({ ...example.input, referenceIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite supplyVolts",
    (value) =>
      expect(tool.execute({ ...example.input, supplyVolts: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { capacitances: [] },
    { referenceIndex: 3 },
    { capacitances: [0, 4, 4] },
    { referenceIndex: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { capacitances: [] },
    { referenceIndex: 3 },
    { capacitances: [0, 4, 4] },
    { referenceIndex: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("nested finite capacitances validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, capacitances: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "capacitances" }],
        },
      });
    },
  );
});

describe("independently reviewed regressions", () => {
  it("a one-capacitor list receives the complete signed supply", () => {
    const output = calculate({
      capacitances: [2],
      referenceIndex: 0,
      supplyVolts: -12,
    });
    expect(output).toMatchObject({ voltageShare: 1, referenceVoltage: -12 });
    expect(
      tool.execute({ capacitances: [2], referenceIndex: 0, supplyVolts: -12 }),
    ).toEqual({ ok: true, output });
  });
  it("handles widely separated capacitances without reciprocal overflow", () => {
    const output = calculate({
      capacitances: [1e-300, 1e300],
      referenceIndex: 0,
      supplyVolts: 12,
    });
    expect(output).toMatchObject({ voltageShare: 1, referenceVoltage: 12 });
    expect(
      tool.execute({
        capacitances: [1e-300, 1e300],
        referenceIndex: 0,
        supplyVolts: 12,
      }),
    ).toEqual({ ok: true, output });
  });
  it("equal three-way capacitances divide voltage equally", () => {
    const output = calculate({
      capacitances: [4, 4, 4],
      referenceIndex: 2,
      supplyVolts: 12,
    });
    expect(output).toMatchObject({ referenceVoltage: 4 });
    expect(output.voltageShare).toBeCloseTo(0.3333333333333333, 15);
    expect(
      tool.execute({
        capacitances: [4, 4, 4],
        referenceIndex: 2,
        supplyVolts: 12,
      }),
    ).toEqual({ ok: true, output });
  });
});
