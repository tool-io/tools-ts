import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("global-studies/transnational-project-local-cost-price-factor", () => {
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
        localCost: 800,
        localPriceIndex: 100,
        basePriceIndex: 100,
        targetCurrencyPerLocal: 0.5,
        overheadFraction: 0.2,
      }),
    ).toEqual({
      ok: true,
      output: {
        baseLocalCost: 800,
        convertedCost: 400,
        includingOverhead: 480,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite localCost", (value) =>
    expect(tool.execute({ ...example.input, localCost: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite localPriceIndex",
    (value) =>
      expect(
        tool.execute({ ...example.input, localPriceIndex: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite basePriceIndex",
    (value) =>
      expect(tool.execute({ ...example.input, basePriceIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetCurrencyPerLocal",
    (value) =>
      expect(
        tool.execute({ ...example.input, targetCurrencyPerLocal: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite overheadFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, overheadFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { localPriceIndex: 0 },
    { basePriceIndex: 0 },
    { targetCurrencyPerLocal: 0 },
    { overheadFraction: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { localPriceIndex: 0 },
    { basePriceIndex: 0 },
    { targetCurrencyPerLocal: 0 },
    { overheadFraction: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
