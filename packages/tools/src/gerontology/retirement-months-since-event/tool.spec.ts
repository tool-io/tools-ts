import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("gerontology/retirement-months-since-event", () => {
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
        retirementYear: 2026,
        retirementMonth: 12,
        asOfYear: 2026,
        asOfMonth: 11,
      }),
    ).toEqual({ ok: true, output: { signedCalendarMonthOffset: -1 } });
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
    "rejects nonfinite retirementYear",
    (value) =>
      expect(tool.execute({ ...example.input, retirementYear: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite retirementMonth",
    (value) =>
      expect(
        tool.execute({ ...example.input, retirementMonth: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite asOfYear", (value) =>
    expect(tool.execute({ ...example.input, asOfYear: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite asOfMonth", (value) =>
    expect(tool.execute({ ...example.input, asOfMonth: value }).ok).toBe(false),
  );
  it.each([
    { retirementYear: 0 },
    { retirementYear: 10000 },
    { retirementMonth: 0 },
    { retirementMonth: 13 },
    { asOfYear: 0 },
    { asOfYear: 10000 },
    { asOfMonth: 0 },
    { asOfMonth: 13 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { retirementYear: 0 },
    { retirementYear: 10000 },
    { retirementMonth: 0 },
    { retirementMonth: 13 },
    { asOfYear: 0 },
    { asOfYear: 10000 },
    { asOfMonth: 0 },
    { asOfMonth: 13 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
