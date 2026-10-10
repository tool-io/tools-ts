import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("parse/http-date-weekday-token-match", () => {
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
      tool.execute({ calendarDate: "2026-11-01", weekdayToken: "Mon" }),
    ).toEqual({ ok: true, output: { matches: false, expectedWeekday: "Sun" } });
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

  it.each([{ weekdayToken: "__invalid_enum__" }])(
    "rejects documented invalid domains %j",
    (change) => {
      const r = tool.execute({ ...example.input, ...change });
      expect(r.ok).toBe(false);
      if (!r.ok) expect(r.error.code).toBe("invalid_input");
    },
  );
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([{ weekdayToken: "__invalid_enum__" }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("rejects malformed calendar text for calendarDate", () => {
    const input = { ...example.input, calendarDate: "2026-02-30" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "calendarDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for calendarDate", () => {
    const input = { ...example.input, calendarDate: "2026-11-01\n" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "calendarDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("rejects malformed calendar text for calendarDate", () => {
    const input = { ...example.input, calendarDate: "not-a-date" };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "calendarDate", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ calendarDate: "0000-01-01", weekdayToken: "Sat" },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { matches: true, expectedWeekday: "Sat" },
    });
    expect(calculate(input)).toEqual({ matches: true, expectedWeekday: "Sat" });
  });
});
