import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geophysics/geophone-natural-frequency-response-ratio", () => {
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
    expect(tool.execute({ frequencyRatio: 0, dampingRatio: 0.7 })).toEqual({
      ok: true,
      output: { amplitudeRatio: 0 },
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
    "rejects nonfinite frequencyRatio",
    (value) =>
      expect(tool.execute({ ...example.input, frequencyRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dampingRatio",
    (value) =>
      expect(tool.execute({ ...example.input, dampingRatio: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { frequencyRatio: 1, dampingRatio: 0 },
    { frequencyRatio: -1 },
    { frequencyRatio: -1 },
    { dampingRatio: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { frequencyRatio: 1, dampingRatio: 0 },
    { frequencyRatio: -1 },
    { frequencyRatio: -1 },
    { dampingRatio: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 66 review regressions", () => {
  it("preserves the high-frequency limit without squaring overflow", () => {
    expect(calculate({ frequencyRatio: 1e200, dampingRatio: 0.7 })).toEqual({
      amplitudeRatio: 1,
    });
  });
  it("retains a representable subnormal response under extreme damping", () => {
    const r = calculate({ frequencyRatio: 1, dampingRatio: 1e308 });
    expect(r.amplitudeRatio).toBeGreaterThan(0);
    expect(r.amplitudeRatio / 5e-309).toBeCloseTo(1, 14);
  });
});
