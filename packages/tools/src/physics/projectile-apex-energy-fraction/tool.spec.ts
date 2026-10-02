import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("physics/projectile-apex-energy-fraction", () => {
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
    expect(tool.execute({ horizontalSpeed: 0, verticalSpeed: 5 })).toEqual({
      ok: true,
      output: { retainedKineticFraction: 0, initialSpeedSquared: 25 },
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
    "rejects nonfinite horizontalSpeed",
    (value) =>
      expect(
        tool.execute({ ...example.input, horizontalSpeed: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite verticalSpeed",
    (value) =>
      expect(tool.execute({ ...example.input, verticalSpeed: value }).ok).toBe(
        false,
      ),
  );
});

describe("batch 71 independent regressions", () => {
  it("ignores horizontal direction in kinetic energy", () => {
    expect(calculate({ horizontalSpeed: -3, verticalSpeed: 4 })).toEqual({
      retainedKineticFraction: 0.36,
      initialSpeedSquared: 25,
    });
    expect(tool.execute({ horizontalSpeed: -3, verticalSpeed: 4 })).toEqual({
      ok: true,
      output: { retainedKineticFraction: 0.36, initialSpeedSquared: 25 },
    });
  });
});
