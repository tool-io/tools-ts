import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-economics/external-debt-currency-valuation-one-term", () => {
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
        foreignPrincipal: 200,
        oldDomesticPerForeign: 1.5,
        newDomesticPerForeign: 1.4,
        foreignPrincipalChange: -20,
      }),
    ).toEqual({
      ok: true,
      output: {
        openingDomestic: 300,
        closingDomestic: 251.99999999999997,
        valuationOnOpening: -20.000000000000018,
        transactionAtNewRate: -28,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite foreignPrincipal",
    (value) =>
      expect(
        tool.execute({ ...example.input, foreignPrincipal: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite oldDomesticPerForeign",
    (value) =>
      expect(
        tool.execute({ ...example.input, oldDomesticPerForeign: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite newDomesticPerForeign",
    (value) =>
      expect(
        tool.execute({ ...example.input, newDomesticPerForeign: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite foreignPrincipalChange",
    (value) =>
      expect(
        tool.execute({ ...example.input, foreignPrincipalChange: value }).ok,
      ).toBe(false),
  );
  it.each([
    { foreignPrincipal: -1 },
    { oldDomesticPerForeign: 0 },
    { newDomesticPerForeign: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { foreignPrincipal: -1 },
    { oldDomesticPerForeign: 0 },
    { newDomesticPerForeign: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
