import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("dietetics/nutrition-label-drained-whole-basis", () => {
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
        wholeMass: 400,
        drainedMass: 200,
        totalNutrient: 40,
        drainedRetainedFraction: 1,
      }),
    ).toEqual({
      ok: true,
      output: {
        drainedYield: 0.5,
        drainedConcentration: 0.2,
        wholeConcentration: 0.1,
      },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite wholeMass", (value) =>
    expect(tool.execute({ ...example.input, wholeMass: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite drainedMass",
    (value) =>
      expect(tool.execute({ ...example.input, drainedMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite totalNutrient",
    (value) =>
      expect(tool.execute({ ...example.input, totalNutrient: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite drainedRetainedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, drainedRetainedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { wholeMass: 0 },
    { drainedMass: 0 },
    { totalNutrient: -1 },
    { drainedRetainedFraction: -1 },
    { drainedRetainedFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
