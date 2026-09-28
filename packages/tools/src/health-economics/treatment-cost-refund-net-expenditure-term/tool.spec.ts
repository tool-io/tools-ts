import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("health-economics/treatment-cost-refund-net-expenditure-term", () => {
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
        treated: 50,
        pricePerTreatment: 200,
        refundedFraction: 0.1,
        rebatePerRefund: 200,
        administrationCost: 0,
      }),
    ).toEqual({
      ok: true,
      output: { grossCost: 10000, expectedRefund: 1000, netCost: 9000 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite treated", (value) =>
    expect(tool.execute({ ...example.input, treated: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pricePerTreatment",
    (value) =>
      expect(
        tool.execute({ ...example.input, pricePerTreatment: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite refundedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, refundedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rebatePerRefund",
    (value) =>
      expect(
        tool.execute({ ...example.input, rebatePerRefund: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite administrationCost",
    (value) =>
      expect(
        tool.execute({ ...example.input, administrationCost: value }).ok,
      ).toBe(false),
  );
  it.each([
    { treated: -1 },
    { pricePerTreatment: -1 },
    { refundedFraction: -1 },
    { refundedFraction: 2 },
    { rebatePerRefund: -1 },
    { administrationCost: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { treated: -1 },
    { pricePerTreatment: -1 },
    { refundedFraction: -1 },
    { refundedFraction: 2 },
    { rebatePerRefund: -1 },
    { administrationCost: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
