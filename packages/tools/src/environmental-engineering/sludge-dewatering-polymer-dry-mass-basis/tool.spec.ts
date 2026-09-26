import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-engineering/sludge-dewatering-polymer-dry-mass-basis", () => {
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
        sludgeMass: 500,
        solidsFraction: 0.1,
        dosePerDryMass: 0.002,
        solutionActiveFraction: 0.02,
      }),
    ).toEqual({
      ok: true,
      output: { dryMass: 50, activePolymer: 0.1, solutionMass: 5 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sludgeMass", (value) =>
    expect(tool.execute({ ...example.input, sludgeMass: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite solidsFraction",
    (value) =>
      expect(tool.execute({ ...example.input, solidsFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite dosePerDryMass",
    (value) =>
      expect(tool.execute({ ...example.input, dosePerDryMass: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite solutionActiveFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, solutionActiveFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { sludgeMass: -1 },
    { solidsFraction: -1 },
    { solidsFraction: 2 },
    { dosePerDryMass: -1 },
    { solutionActiveFraction: 0 },
    { solutionActiveFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
