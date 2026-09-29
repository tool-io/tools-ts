import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("international-business/international-contract-translation-page-cost", () => {
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
        pages: 20,
        translatedFraction: 0.5,
        pricePerPage: 30,
        certificationFee: 0,
        rushFraction: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: { translatedPages: 10, baseCost: 300, totalCost: 330 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pages", (value) =>
    expect(tool.execute({ ...example.input, pages: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite translatedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, translatedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pricePerPage",
    (value) =>
      expect(tool.execute({ ...example.input, pricePerPage: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite certificationFee",
    (value) =>
      expect(
        tool.execute({ ...example.input, certificationFee: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rushFraction",
    (value) =>
      expect(tool.execute({ ...example.input, rushFraction: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { pages: -1 },
    { translatedFraction: -1 },
    { translatedFraction: 2 },
    { pricePerPage: -1 },
    { certificationFee: -1 },
    { rushFraction: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { pages: -1 },
    { translatedFraction: -1 },
    { translatedFraction: 2 },
    { pricePerPage: -1 },
    { certificationFee: -1 },
    { rushFraction: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
