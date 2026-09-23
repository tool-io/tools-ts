import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("biomechanics/joint-axis-angle-wrapping-gap", () => {
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
        angleDegrees: 180,
        referenceDegrees: 0,
        periodDegrees: 360,
      }),
    ).toEqual({ ok: true, output: { signedWrappedGap: 180, antipodal: true } });
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
    "rejects nonfinite angleDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, angleDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite referenceDegrees",
    (value) =>
      expect(
        tool.execute({ ...example.input, referenceDegrees: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite periodDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, periodDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ periodDegrees: 0 }])(
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
  it.each([{ periodDegrees: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("independently reviewed regressions", () => {
  it("zero separation is not antipodal on a minimum subnormal period", () => {
    const output = calculate({
      angleDegrees: 0,
      referenceDegrees: 0,
      periodDegrees: 5e-324,
    });
    expect(output).toMatchObject({ signedWrappedGap: 0, antipodal: false });
    expect(
      tool.execute({
        angleDegrees: 0,
        referenceDegrees: 0,
        periodDegrees: 5e-324,
      }),
    ).toEqual({ ok: true, output });
  });
});
