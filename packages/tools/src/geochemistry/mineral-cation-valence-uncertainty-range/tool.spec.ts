import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("geochemistry/mineral-cation-valence-uncertainty-range", () => {
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
        cationCount: 1,
        minimumValence: 2,
        maximumValence: 4,
        knownPositiveCharge: 2,
        anionNegativeCharge: 7,
      }),
    ).toEqual({
      ok: true,
      output: {
        minimumPositiveCharge: 4,
        maximumPositiveCharge: 6,
        chargeBalancePossible: false,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite cationCount",
    (value) =>
      expect(tool.execute({ ...example.input, cationCount: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite minimumValence",
    (value) =>
      expect(tool.execute({ ...example.input, minimumValence: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite maximumValence",
    (value) =>
      expect(tool.execute({ ...example.input, maximumValence: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite knownPositiveCharge",
    (value) =>
      expect(
        tool.execute({ ...example.input, knownPositiveCharge: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite anionNegativeCharge",
    (value) =>
      expect(
        tool.execute({ ...example.input, anionNegativeCharge: value }).ok,
      ).toBe(false),
  );
  it.each([
    { cationCount: -1 },
    { minimumValence: -1 },
    { knownPositiveCharge: -1 },
    { anionNegativeCharge: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
