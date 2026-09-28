import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("gerontology/retirement-resource-real-value-index-term", () => {
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
        nominalIncome: 1200,
        nominalCost: 1000,
        incomeIndex: 100,
        costIndex: 100,
        baseIncomeIndex: 100,
        baseCostIndex: 100,
      }),
    ).toEqual({
      ok: true,
      output: { realIncome: 1200, realCost: 1000, realSurplus: 200 },
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
    "rejects nonfinite nominalIncome",
    (value) =>
      expect(tool.execute({ ...example.input, nominalIncome: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite nominalCost",
    (value) =>
      expect(tool.execute({ ...example.input, nominalCost: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite incomeIndex",
    (value) =>
      expect(tool.execute({ ...example.input, incomeIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite costIndex", (value) =>
    expect(tool.execute({ ...example.input, costIndex: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite baseIncomeIndex",
    (value) =>
      expect(
        tool.execute({ ...example.input, baseIncomeIndex: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite baseCostIndex",
    (value) =>
      expect(tool.execute({ ...example.input, baseCostIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { incomeIndex: 0 },
    { costIndex: 0 },
    { baseIncomeIndex: 0 },
    { baseCostIndex: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { incomeIndex: 0 },
    { costIndex: 0 },
    { baseIncomeIndex: 0 },
    { baseCostIndex: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
