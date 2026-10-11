import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("sustainable-agriculture/soil-carbon-depth-mass-factor", () => {
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
        bulkDensityKilogramsPerCubicMeter: 1000,
        depthMeters: 0,
        carbonMassFraction: 0.03,
      }),
    ).toEqual({ ok: true, output: { carbonKilogramsPerSquareMeter: 0 } });
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
    "rejects nonfinite bulkDensityKilogramsPerCubicMeter",
    (value) =>
      expect(
        tool.execute({
          ...example.input,
          bulkDensityKilogramsPerCubicMeter: value,
        }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite depthMeters",
    (value) =>
      expect(tool.execute({ ...example.input, depthMeters: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite carbonMassFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, carbonMassFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { bulkDensityKilogramsPerCubicMeter: -1 },
    { depthMeters: -1 },
    { carbonMassFraction: -1 },
    { carbonMassFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { bulkDensityKilogramsPerCubicMeter: -1 },
    { depthMeters: -1 },
    { carbonMassFraction: -1 },
    { carbonMassFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
