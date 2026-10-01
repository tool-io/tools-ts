import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("optometry/lens-edge-center-thickness-geometry-term", () => {
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
        semiDiameter: 0,
        frontRadius: 5,
        backRadius: 5,
        centerThickness: 2,
        frontConvex: true,
        backConvex: false,
      }),
    ).toEqual({
      ok: true,
      output: { frontSag: 0, backSag: 0, edgeThickness: 2 },
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
    "rejects nonfinite semiDiameter",
    (value) =>
      expect(tool.execute({ ...example.input, semiDiameter: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite frontRadius",
    (value) =>
      expect(tool.execute({ ...example.input, frontRadius: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite backRadius", (value) =>
    expect(tool.execute({ ...example.input, backRadius: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite centerThickness",
    (value) =>
      expect(
        tool.execute({ ...example.input, centerThickness: value }).ok,
      ).toBe(false),
  );
  it.each([
    { semiDiameter: -1 },
    { frontRadius: 0 },
    { backRadius: 0 },
    { centerThickness: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { semiDiameter: -1 },
    { frontRadius: 0 },
    { backRadius: 0 },
    { centerThickness: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 67 review regressions", () => {
  it("retains a small spherical sagitta without cancellation", () => {
    const r = calculate({
      semiDiameter: 1e-5,
      frontRadius: 1e8,
      backRadius: 1e8,
      centerThickness: 1,
      frontConvex: true,
      backConvex: true,
    });
    expect(r.frontSag).toBeGreaterThan(0);
    expect(r.frontSag / 5e-19).toBeCloseTo(1, 14);
  });
});
