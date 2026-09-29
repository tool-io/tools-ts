import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-business/export-rebate-eligible-net-value-term", () => {
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
        invoiceGoods: 5000,
        returnedGoods: 500,
        ineligibleGoods: 500,
        rebateRate: 0.2,
        cap: 600,
      }),
    ).toEqual({
      ok: true,
      output: { eligibleNet: 4000, uncappedRebate: 800, rebate: 600 },
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
    "rejects nonfinite invoiceGoods",
    (value) =>
      expect(tool.execute({ ...example.input, invoiceGoods: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite returnedGoods",
    (value) =>
      expect(tool.execute({ ...example.input, returnedGoods: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite ineligibleGoods",
    (value) =>
      expect(
        tool.execute({ ...example.input, ineligibleGoods: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rebateRate", (value) =>
    expect(tool.execute({ ...example.input, rebateRate: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cap", (value) =>
    expect(tool.execute({ ...example.input, cap: value }).ok).toBe(false),
  );
  it.each([
    { invoiceGoods: -1 },
    { returnedGoods: -1 },
    { ineligibleGoods: -1 },
    { rebateRate: -1 },
    { cap: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { invoiceGoods: -1 },
    { returnedGoods: -1 },
    { ineligibleGoods: -1 },
    { rebateRate: -1 },
    { cap: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
