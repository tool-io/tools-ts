import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("endocrinology/sample-circadian-phase-fraction", () => {
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
      tool.execute({ sampleAt: -6, cycleOrigin: 0, cycleDuration: 24 }),
    ).toEqual({ ok: true, output: { phaseFraction: 0.75 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sampleAt", (value) =>
    expect(tool.execute({ ...example.input, sampleAt: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cycleOrigin",
    (value) =>
      expect(tool.execute({ ...example.input, cycleOrigin: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cycleDuration",
    (value) =>
      expect(tool.execute({ ...example.input, cycleDuration: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ cycleDuration: 0 }, { cycleDuration: 0 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ cycleDuration: 0 }, { cycleDuration: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("modular precision regressions", () => {
  it("retains a positive phase far below the cycle duration", () => {
    expect(
      calculate({ sampleAt: 1, cycleOrigin: 0, cycleDuration: 1e300 }),
    ).toEqual({ phaseFraction: 1e-300 });
    expect(
      tool.execute({ sampleAt: 1, cycleOrigin: 0, cycleDuration: 1e300 }),
    ).toEqual({ ok: true, output: { phaseFraction: 1e-300 } });
  });
});
