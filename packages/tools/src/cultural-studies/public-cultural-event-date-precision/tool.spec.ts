import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("cultural-studies/public-cultural-event-date-precision", () => {
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
      tool.execute({ year: 2024, month: 2, day: 29, precision: "day" }),
    ).toEqual({ ok: true, output: { label: "2024-02-29" } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite year", (value) =>
    expect(tool.execute({ ...example.input, year: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite month", (value) =>
    expect(tool.execute({ ...example.input, month: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite day", (value) =>
    expect(tool.execute({ ...example.input, day: value }).ok).toBe(false),
  );
  it.each([
    { year: 2025, month: 2, day: 29, precision: "day" },
    { year: 0 },
    { year: 10000 },
    { month: -1 },
    { month: 13 },
    { day: -1 },
    { day: 32 },
    { precision: "__invalid_enum__" },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { year: 2025, month: 2, day: 29, precision: "day" },
    { year: 0 },
    { year: 10000 },
    { month: -1 },
    { month: 13 },
    { day: -1 },
    { day: 32 },
    { precision: "__invalid_enum__" },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

// batch75 review regressions
it("preserves unknown fields and checks leap days", () => {
  expect(
    calculate({ year: 2026, month: 0, day: 0, precision: "year" }),
  ).toEqual({ label: "2026" });
  expect(
    calculate({ year: 2026, month: 11, day: 0, precision: "month" }),
  ).toEqual({ label: "2026-11" });
  expect(
    calculate({ year: 2024, month: 2, day: 29, precision: "day" }),
  ).toEqual({ label: "2024-02-29" });
  expect(
    tool.execute({ year: 2025, month: 2, day: 29, precision: "day" }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_domain", field: "day" }] },
  });
  expect(
    tool.execute({ year: 2026, month: 1, day: 0, precision: "year" }),
  ).toMatchObject({
    ok: false,
    error: { issues: [{ code: "invalid_domain", field: "month" }] },
  });
});
