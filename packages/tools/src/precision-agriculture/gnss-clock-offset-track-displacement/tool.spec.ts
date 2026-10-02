import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("precision-agriculture/gnss-clock-offset-track-displacement", () => {
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
        offsetSeconds: -2,
        speed: 5,
        suppliedMetersPerSecondPerSpeedUnit: 1,
        headingDegrees: 0,
      }),
    ).toEqual({
      ok: true,
      output: { signedDistanceMeters: -10, eastMeters: 0, northMeters: -10 },
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
    "rejects nonfinite offsetSeconds",
    (value) =>
      expect(tool.execute({ ...example.input, offsetSeconds: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite speed", (value) =>
    expect(tool.execute({ ...example.input, speed: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedMetersPerSecondPerSpeedUnit",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          suppliedMetersPerSecondPerSpeedUnit: value,
        }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite headingDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, headingDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ speed: -1 }, { suppliedMetersPerSecondPerSpeedUnit: 0 }])(
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
  it.each([{ speed: -1 }, { suppliedMetersPerSecondPerSpeedUnit: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 71 independent regressions", () => {
  it("resolves a supplied eastward heading without rounding the calculation", () => {
    expect(
      calculate({
        offsetSeconds: 2,
        speed: 10,
        suppliedMetersPerSecondPerSpeedUnit: 1,
        headingDegrees: 90,
      }),
    ).toEqual({
      signedDistanceMeters: expect.closeTo(20, 12),
      eastMeters: expect.closeTo(20, 12),
      northMeters: expect.closeTo(0, 12),
    });
    expect(
      tool.execute({
        offsetSeconds: 2,
        speed: 10,
        suppliedMetersPerSecondPerSpeedUnit: 1,
        headingDegrees: 90,
      }),
    ).toEqual({
      ok: true,
      output: {
        signedDistanceMeters: expect.closeTo(20, 12),
        eastMeters: expect.closeTo(20, 12),
        northMeters: expect.closeTo(0, 12),
      },
    });
  });
});
