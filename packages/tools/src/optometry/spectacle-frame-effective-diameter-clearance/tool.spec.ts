import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("optometry/spectacle-frame-effective-diameter-clearance", () => {
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
        blankDiameter: 50,
        effectiveDiameter: 46,
        horizontalOffset: 0,
        verticalOffset: 0,
        radialAllowance: 3,
      }),
    ).toEqual({
      ok: true,
      output: { requiredDiameter: 52, residualClearance: -2, fits: false },
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
    "rejects nonfinite blankDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, blankDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite effectiveDiameter",
    (value) =>
      expect(
        tool.execute({ ...example.input, effectiveDiameter: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite horizontalOffset",
    (value) =>
      expect(
        tool.execute({ ...example.input, horizontalOffset: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite verticalOffset",
    (value) =>
      expect(tool.execute({ ...example.input, verticalOffset: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite radialAllowance",
    (value) =>
      expect(
        tool.execute({ ...example.input, radialAllowance: value }).ok,
      ).toBe(false),
  );
  it.each([
    { blankDiameter: -1 },
    { effectiveDiameter: -1 },
    { radialAllowance: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { blankDiameter: -1 },
    { effectiveDiameter: -1 },
    { radialAllowance: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 67 review regressions", () => {
  it("reports residual clearance after the supplied effective diameter and allowance", () => {
    expect(
      calculate({
        blankDiameter: 50,
        effectiveDiameter: 46,
        horizontalOffset: 0,
        verticalOffset: 0,
        radialAllowance: 3,
      }),
    ).toEqual({ requiredDiameter: 52, residualClearance: -2, fits: false });
  });
});
