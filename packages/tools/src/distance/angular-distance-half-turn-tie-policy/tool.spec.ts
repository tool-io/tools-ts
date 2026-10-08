import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("distance/angular-distance-half-turn-tie-policy", () => {
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
        firstDegrees: 0,
        secondDegrees: 180,
        positiveHalfturn: false,
      }),
    ).toEqual({ ok: true, output: { signedShortestDegrees: -180 } });
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
    "rejects nonfinite firstDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, firstDegrees: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite secondDegrees",
    (value) =>
      expect(tool.execute({ ...example.input, secondDegrees: value }).ok).toBe(
        false,
      ),
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ firstDegrees: 0, secondDegrees: -180, positiveHalfturn: true },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { signedShortestDegrees: 180 },
    });
    expect(calculate(input)).toEqual({ signedShortestDegrees: 180 });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ firstDegrees: 0, secondDegrees: 5e-324, positiveHalfturn: true },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { signedShortestDegrees: 5e-324 },
    });
    expect(calculate(input)).toEqual({ signedShortestDegrees: 5e-324 });
  });
});
