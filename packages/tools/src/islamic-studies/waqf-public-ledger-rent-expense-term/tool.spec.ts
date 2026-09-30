import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("islamic-studies/waqf-public-ledger-rent-expense-term", () => {
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
        rentDue: 5000,
        rentCollected: 5000,
        maintenance: 1000,
        administration: 500,
        reservedFraction: 0.1,
      }),
    ).toEqual({
      ok: true,
      output: {
        arrears: 0,
        operatingSurplus: 3500,
        reserved: 350,
        distributable: 3150,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite rentDue", (value) =>
    expect(tool.execute({ ...example.input, rentDue: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite rentCollected",
    (value) =>
      expect(tool.execute({ ...example.input, rentCollected: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite maintenance",
    (value) =>
      expect(tool.execute({ ...example.input, maintenance: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite administration",
    (value) =>
      expect(tool.execute({ ...example.input, administration: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite reservedFraction",
    (value) =>
      expect(
        tool.execute({ ...example.input, reservedFraction: value }).ok,
      ).toBe(false),
  );
  it.each([
    { rentDue: -1 },
    { rentCollected: -1 },
    { maintenance: -1 },
    { administration: -1 },
    { reservedFraction: -1 },
    { reservedFraction: 2 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { rentDue: -1 },
    { rentCollected: -1 },
    { maintenance: -1 },
    { administration: -1 },
    { reservedFraction: -1 },
    { reservedFraction: 2 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
