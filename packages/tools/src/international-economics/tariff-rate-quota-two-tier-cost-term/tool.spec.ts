import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-economics/tariff-rate-quota-two-tier-cost-term", () => {
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
        quantity: 80,
        quotaRemaining: 100,
        inQuotaRate: 0.1,
        outQuotaRate: 0.3,
        customsValuePerUnit: 20,
      }),
    ).toEqual({
      ok: true,
      output: { inQuotaQuantity: 80, outQuotaQuantity: 0, duty: 160 },
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
    "rejects nonfinite quotaRemaining",
    (value) =>
      expect(tool.execute({ ...example.input, quotaRemaining: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite inQuotaRate",
    (value) =>
      expect(tool.execute({ ...example.input, inQuotaRate: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite outQuotaRate",
    (value) =>
      expect(tool.execute({ ...example.input, outQuotaRate: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite customsValuePerUnit",
    (value) =>
      expect(
        tool.execute({ ...example.input, customsValuePerUnit: value }).ok,
      ).toBe(false),
  );
  it.each([
    { quantity: -1 },
    { quotaRemaining: -1 },
    { inQuotaRate: -1 },
    { outQuotaRate: -1 },
    { customsValuePerUnit: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { quantity: -1 },
    { quotaRemaining: -1 },
    { inQuotaRate: -1 },
    { outQuotaRate: -1 },
    { customsValuePerUnit: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
