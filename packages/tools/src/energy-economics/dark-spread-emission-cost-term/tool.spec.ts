import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("energy-economics/dark-spread-emission-cost-term", () => {
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
        powerPrice: 100,
        coalPrice: 15,
        fuelUnitsPerMwh: 3,
        emissionsPerMwh: 1,
        carbonPrice: 20,
        variableCost: 10,
      }),
    ).toEqual({
      ok: true,
      output: { fuelCost: 45, carbonCost: 20, cleanDarkSpread: 25 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite powerPrice", (value) =>
    expect(tool.execute({ ...example.input, powerPrice: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite coalPrice", (value) =>
    expect(tool.execute({ ...example.input, coalPrice: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite fuelUnitsPerMwh",
    (value) =>
      expect(
        tool.execute({ ...example.input, fuelUnitsPerMwh: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite emissionsPerMwh",
    (value) =>
      expect(
        tool.execute({ ...example.input, emissionsPerMwh: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite carbonPrice",
    (value) =>
      expect(tool.execute({ ...example.input, carbonPrice: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite variableCost",
    (value) =>
      expect(tool.execute({ ...example.input, variableCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ fuelUnitsPerMwh: -1 }, { emissionsPerMwh: -1 }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});
