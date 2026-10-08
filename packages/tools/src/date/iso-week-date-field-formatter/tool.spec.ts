import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("date/iso-week-date-field-formatter", () => {
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
    expect(tool.execute({ weekYear: 2020, week: 53, weekday: 4 })).toEqual({
      ok: true,
      output: { weekDate: "2020-W53-4" },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite weekYear", (value) =>
    expect(tool.execute({ ...example.input, weekYear: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite week", (value) =>
    expect(tool.execute({ ...example.input, week: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite weekday", (value) =>
    expect(tool.execute({ ...example.input, weekday: value }).ok).toBe(false),
  );
  it.each([
    { weekYear: -1 },
    { weekYear: 10000 },
    { week: 0 },
    { week: 54 },
    { weekday: 0 },
    { weekday: 8 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { weekYear: -1 },
    { weekYear: 10000 },
    { week: 0 },
    { week: 54 },
    { weekday: 0 },
    { weekday: 8 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ weekYear: 2026, week: 53, weekday: 7 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { weekDate: "2026-W53-7" },
    });
    expect(calculate(input)).toEqual({ weekDate: "2026-W53-7" });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ weekYear: 2025, week: 53 } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "week", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
