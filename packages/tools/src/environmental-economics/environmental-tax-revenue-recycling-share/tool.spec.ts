import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("environmental-economics/environmental-tax-revenue-recycling-share", () => {
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
        taxBase: 50000,
        rate: 0.2,
        administrationCost: 0,
        recyclingFraction: 0.5,
        households: 200,
      }),
    ).toEqual({
      ok: true,
      output: {
        grossRevenue: 10000,
        recycled: 5000,
        perHousehold: 25,
        retained: 5000,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite taxBase", (value) =>
    expect(tool.execute({ ...example.input, taxBase: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rate", (value) =>
    expect(tool.execute({ ...example.input, rate: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite administrationCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, administrationCost: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recyclingFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, recyclingFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite households", (value) =>
    expect(tool.execute({ ...example.input, households: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { taxBase: -1 },
    { rate: -1 },
    { administrationCost: -1 },
    { recyclingFraction: -1 },
    { recyclingFraction: 2 },
    { households: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
