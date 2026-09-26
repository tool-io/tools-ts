import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-economics/environmental-subsidy-additionality-caller-share", () => {
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
        subsidy: 6000,
        observedReduction: 800,
        additionalFraction: 0.75,
        leakageFraction: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        additionalReduction: 600,
        netReduction: 600,
        subsidyPerNetUnit: 10,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite subsidy", (value) =>
    expect(tool.execute({ ...example.input, subsidy: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite observedReduction",
    (value) =>
      expect(
        tool.execute({ ...example.input, observedReduction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite additionalFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, additionalFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite leakageFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, leakageFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { subsidy: -1 },
    { observedReduction: 0 },
    { additionalFraction: 0 },
    { additionalFraction: 2 },
    { leakageFraction: -1 },
    { leakageFraction: 1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
