import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("agroinformatics/crop-season-year-explicit-anchor", () => {
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
        calendarYear: 2026,
        month: 2,
        seasonStartMonth: 9,
        labelByEndYear: false,
      }),
    ).toEqual({ ok: true, output: { seasonYear: 2025 } });
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
    "rejects nonfinite calendarYear",
    (value) =>
      expect(tool.execute({ ...example.input, calendarYear: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite month", (value) =>
    expect(tool.execute({ ...example.input, month: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite seasonStartMonth",
    (value) =>
      expect(
        tool.execute({ ...example.input, seasonStartMonth: value }).ok,
      ).toBe(false),
  );
  it.each([
    { month: 0 },
    { seasonStartMonth: 13 },
    { month: 0 },
    { month: 13 },
    { seasonStartMonth: 0 },
    { seasonStartMonth: 13 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { month: 0 },
    { seasonStartMonth: 13 },
    { month: 0 },
    { month: 13 },
    { seasonStartMonth: 0 },
    { seasonStartMonth: 13 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch 68 regression review

it("keeps a January-through-December season in its calendar year", () => {
  expect(
    calculate({
      calendarYear: 2026,
      month: 12,
      seasonStartMonth: 1,
      labelByEndYear: true,
    }),
  ).toEqual({ seasonYear: 2026 });
  expect(
    calculate({
      calendarYear: 2026,
      month: 1,
      seasonStartMonth: 1,
      labelByEndYear: false,
    }),
  ).toEqual({ seasonYear: 2026 });
});
