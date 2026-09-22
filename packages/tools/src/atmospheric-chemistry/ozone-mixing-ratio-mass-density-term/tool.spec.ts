import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-chemistry/ozone-mixing-ratio-mass-density-term", () => {
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
        moleFraction: 0.000002,
        pressurePa: 100000,
        molarMassKgPerMol: 0.05,
        temperatureK: 250,
        gasConstant: 8,
      }),
    ).toEqual({
      ok: true,
      output: { molarDensity: 0.00009999999999999999, massDensity: 0.000005 },
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
    "rejects nonfinite moleFraction",
    (value) =>
      expect(tool.execute({ ...example.input, moleFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pressurePa", (value) =>
    expect(tool.execute({ ...example.input, pressurePa: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite molarMassKgPerMol",
    (value) =>
      expect(
        tool.execute({ ...example.input, molarMassKgPerMol: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite temperatureK",
    (value) =>
      expect(tool.execute({ ...example.input, temperatureK: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite gasConstant",
    (value) =>
      expect(tool.execute({ ...example.input, gasConstant: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { moleFraction: -1 },
    { moleFraction: 2 },
    { pressurePa: -1 },
    { molarMassKgPerMol: 0 },
    { temperatureK: 0 },
    { gasConstant: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
