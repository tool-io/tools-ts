import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("finance/compounded-fee-effective-spread", () => {
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
      tool.execute({ grossReturn: 1.1, feeFractionPerPeriod: 0, periods: 2 }),
    ).toEqual({
      ok: true,
      output: { netGrossReturn: 1.1, effectiveFeeSpread: 0 },
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
    "rejects nonfinite grossReturn",
    (value) =>
      expect(tool.execute({ ...example.input, grossReturn: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite feeFractionPerPeriod",
    (value) =>
      expect(
        tool.execute({ ...example.input, feeFractionPerPeriod: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite periods", (value) =>
    expect(tool.execute({ ...example.input, periods: value }).ok).toBe(false),
  );
  it.each([
    { grossReturn: -1 },
    { feeFractionPerPeriod: -1 },
    { feeFractionPerPeriod: 1 },
    { periods: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { grossReturn: -1 },
    { feeFractionPerPeriod: -1 },
    { feeFractionPerPeriod: 1 },
    { periods: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("zero periods apply no fees", () => {
    const output = calculate({
      grossReturn: 1.1,
      feeFractionPerPeriod: 0.25,
      periods: 0,
    });
    expect(output).toMatchObject({
      netGrossReturn: 1.1,
      effectiveFeeSpread: 0,
    });
    expect(
      tool.execute({
        grossReturn: 1.1,
        feeFractionPerPeriod: 0.25,
        periods: 0,
      }),
    ).toEqual({ ok: true, output });
  });
  it("retains tiny effective fee spreads", () => {
    const output = calculate({
      grossReturn: 1,
      feeFractionPerPeriod: 1e-20,
      periods: 1,
    });
    expect(output).toMatchObject({});
    expect(output.effectiveFeeSpread).toBeCloseTo(1e-20, 30);
    expect(
      tool.execute({ grossReturn: 1, feeFractionPerPeriod: 1e-20, periods: 1 }),
    ).toEqual({ ok: true, output });
  });
});
