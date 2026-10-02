import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("pharmacokinetics/pk-absorption-elimination-rate-gap", () => {
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
      tool.execute({ absorptionRate: 1, eliminationRate: 1, time: 1 }),
    ).toEqual({
      ok: true,
      output: { rateGap: 0, timeFactor: 0.36787944117144233, peakTime: 1 },
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
    "rejects nonfinite absorptionRate",
    (value) =>
      expect(tool.execute({ ...example.input, absorptionRate: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite eliminationRate",
    (value) =>
      expect(
        tool.execute({ ...example.input, eliminationRate: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite time", (value) =>
    expect(tool.execute({ ...example.input, time: value }).ok).toBe(false),
  );
  it.each([{ absorptionRate: 0 }, { eliminationRate: 0 }])(
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
  it.each([{ absorptionRate: 0 }, { eliminationRate: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 67 review regressions", () => {
  it("avoids zero times infinity when absorption is slower than elimination", () => {
    const r = calculate({ absorptionRate: 1, eliminationRate: 1000, time: 1 });
    expect(r.timeFactor).toBeGreaterThan(0);
    expect(r.timeFactor / 0.00036824768886030265).toBeCloseTo(1, 14);
  });
  it("preserves the equal-rate peak-time limit for nearby rates", () => {
    expect(
      calculate({
        absorptionRate: 1 + Number.EPSILON,
        eliminationRate: 1,
        time: 1,
      }).peakTime,
    ).toBeCloseTo(1, 14);
  });
});
