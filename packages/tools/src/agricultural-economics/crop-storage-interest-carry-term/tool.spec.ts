import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agricultural-economics/crop-storage-interest-carry-term", () => {
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
        quantity: 50,
        purchasePrice: 30,
        annualRate: 0.08,
        storageDays: 90,
        yearDays: 360,
        storageCostPerUnit: 1,
      }),
    ).toEqual({
      ok: true,
      output: { financingCost: 30, totalCarry: 80, breakEvenSalePrice: 31.6 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite quantity", (value) =>
    expect(tool.execute({ ...example.input, quantity: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite purchasePrice",
    (value) =>
      expect(tool.execute({ ...example.input, purchasePrice: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite annualRate", (value) =>
    expect(tool.execute({ ...example.input, annualRate: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite storageDays",
    (value) =>
      expect(tool.execute({ ...example.input, storageDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite yearDays", (value) =>
    expect(tool.execute({ ...example.input, yearDays: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite storageCostPerUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, storageCostPerUnit: value }).ok,
      ).toBe(false),
  );
  it.each([
    { quantity: -1 },
    { purchasePrice: -1 },
    { annualRate: -1 },
    { storageDays: -1 },
    { yearDays: 0 },
    { storageCostPerUnit: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});
