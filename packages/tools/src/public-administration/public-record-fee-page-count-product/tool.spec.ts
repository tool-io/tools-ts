import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("public-administration/public-record-fee-page-count-product", () => {
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
        chargeablePages: 0,
        suppliedPricePerPage: 0.5,
        fixedFee: 3,
      }),
    ).toEqual({ ok: true, output: { totalFee: 3 } });
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
    "rejects nonfinite chargeablePages",
    (value) =>
      expect(
        tool.execute({ ...example.input, chargeablePages: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedPricePerPage",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedPricePerPage: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite fixedFee", (value) =>
    expect(tool.execute({ ...example.input, fixedFee: value }).ok).toBe(false),
  );
  it.each([
    { chargeablePages: -1 },
    { suppliedPricePerPage: -1 },
    { fixedFee: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { chargeablePages: -1 },
    { suppliedPricePerPage: -1 },
    { fixedFee: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
