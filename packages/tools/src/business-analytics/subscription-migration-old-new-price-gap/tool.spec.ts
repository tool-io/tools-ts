import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("business-analytics/subscription-migration-old-new-price-gap", () => {
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
        customers: 50,
        oldMonthlyPrice: 20,
        newMonthlyPrice: 25,
        retainedFraction: 0.6,
        migrationCost: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        oldMrr: 1000,
        projectedMrr: 750,
        monthlyChange: -250,
        firstMonthNetChange: -250,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite customers", (value) =>
    expect(tool.execute({ ...example.input, customers: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite oldMonthlyPrice",
    (value) =>
      expect(
        tool.execute({ ...example.input, oldMonthlyPrice: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite newMonthlyPrice",
    (value) =>
      expect(
        tool.execute({ ...example.input, newMonthlyPrice: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retainedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, retainedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite migrationCost",
    (value) =>
      expect(tool.execute({ ...example.input, migrationCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { customers: -1 },
    { oldMonthlyPrice: -1 },
    { newMonthlyPrice: -1 },
    { retainedFraction: -1 },
    { retainedFraction: 2 },
    { migrationCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
