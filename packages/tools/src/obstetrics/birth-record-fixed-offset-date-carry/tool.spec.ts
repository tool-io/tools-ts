import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("obstetrics/birth-record-fixed-offset-date-carry", () => {
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
        dayIndex: 200,
        minuteOfDay: 30,
        sourceOffsetMinutes: 120,
        targetOffsetMinutes: 0,
      }),
    ).toEqual({
      ok: true,
      output: { dayIndex: 199, minuteOfDay: 1350, dayCarry: -1 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite dayIndex", (value) =>
    expect(tool.execute({ ...example.input, dayIndex: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite minuteOfDay",
    (value) =>
      expect(tool.execute({ ...example.input, minuteOfDay: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sourceOffsetMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, sourceOffsetMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite targetOffsetMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, targetOffsetMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([
    { minuteOfDay: -1 },
    { minuteOfDay: 1440 },
    { sourceOffsetMinutes: -1440 },
    { sourceOffsetMinutes: 1440 },
    { targetOffsetMinutes: -1440 },
    { targetOffsetMinutes: 1440 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { minuteOfDay: -1 },
    { minuteOfDay: 1440 },
    { sourceOffsetMinutes: -1440 },
    { sourceOffsetMinutes: 1440 },
    { targetOffsetMinutes: -1440 },
    { targetOffsetMinutes: 1440 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 67 review regressions", () => {
  it("preserves the correct prior-day carry at midnight across fixed offsets", () => {
    expect(
      calculate({
        dayIndex: 100,
        minuteOfDay: 0,
        sourceOffsetMinutes: 60,
        targetOffsetMinutes: -60,
      }),
    ).toEqual({ dayIndex: 99, minuteOfDay: 1320, dayCarry: -1 });
  });
});
