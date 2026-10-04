import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("art-history/catalogue-circa-date-interval-field", () => {
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
        centralYear: 1750,
        earlierToleranceYears: 0,
        laterToleranceYears: 0,
      }),
    ).toEqual({
      ok: true,
      output: { earliestYear: 1750, latestYear: 1750, label: "circa 1750" },
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
    "rejects nonfinite centralYear",
    (value) =>
      expect(tool.execute({ ...example.input, centralYear: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite earlierToleranceYears",
    (value) =>
      expect(
        tool.execute({ ...example.input, earlierToleranceYears: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite laterToleranceYears",
    (value) =>
      expect(
        tool.execute({ ...example.input, laterToleranceYears: value }).ok,
      ).toBe(false),
  );
  it.each([
    { centralYear: -100001 },
    { centralYear: 100001 },
    { earlierToleranceYears: -1 },
    { earlierToleranceYears: 100001 },
    { laterToleranceYears: -1 },
    { laterToleranceYears: 100001 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { centralYear: -100001 },
    { centralYear: 100001 },
    { earlierToleranceYears: -1 },
    { earlierToleranceYears: 100001 },
    { laterToleranceYears: -1 },
    { laterToleranceYears: 100001 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
