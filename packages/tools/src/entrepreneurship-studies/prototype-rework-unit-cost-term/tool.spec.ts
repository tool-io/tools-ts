import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("entrepreneurship-studies/prototype-rework-unit-cost-term", () => {
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
        builtUnits: 50,
        failedUnits: 10,
        reworkFraction: 1,
        reworkCost: 5,
        scrapValue: 0,
        initialCost: 500,
      }),
    ).toEqual({
      ok: true,
      output: { reworkUnits: 10, netCost: 550, costPerSalableUnit: 11 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite builtUnits", (value) =>
    expect(tool.execute({ ...example.input, builtUnits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite failedUnits",
    (value) =>
      expect(tool.execute({ ...example.input, failedUnits: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reworkFraction",
    (value) =>
      expect(tool.execute({ ...example.input, reworkFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite reworkCost", (value) =>
    expect(tool.execute({ ...example.input, reworkCost: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite scrapValue", (value) =>
    expect(tool.execute({ ...example.input, scrapValue: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite initialCost",
    (value) =>
      expect(tool.execute({ ...example.input, initialCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { builtUnits: 0 },
    { failedUnits: -1 },
    { reworkFraction: -1 },
    { reworkFraction: 2 },
    { reworkCost: -1 },
    { scrapValue: -1 },
    { initialCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
