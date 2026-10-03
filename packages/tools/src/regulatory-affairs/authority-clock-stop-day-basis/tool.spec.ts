import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("regulatory-affairs/authority-clock-stop-day-basis", () => {
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
        calendarElapsed: 20,
        suppliedBusinessElapsed: 14,
        stoppedCalendar: 5,
        stoppedBusiness: 3,
        useBusiness: false,
      }),
    ).toEqual({ ok: true, output: { countedDays: 15, stopCredit: 5 } });
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
    "rejects nonfinite calendarElapsed",
    (value) =>
      expect(
        tool.execute({ ...example.input, calendarElapsed: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite suppliedBusinessElapsed",
    (value) =>
      expect(
        tool.execute({ ...example.input, suppliedBusinessElapsed: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite stoppedCalendar",
    (value) =>
      expect(
        tool.execute({ ...example.input, stoppedCalendar: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite stoppedBusiness",
    (value) =>
      expect(
        tool.execute({ ...example.input, stoppedBusiness: value }).ok,
      ).toBe(false),
  );
  it.each([
    { calendarElapsed: -1 },
    { suppliedBusinessElapsed: -1 },
    { stoppedCalendar: -1 },
    { stoppedBusiness: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { calendarElapsed: -1 },
    { suppliedBusinessElapsed: -1 },
    { stoppedCalendar: -1 },
    { stoppedBusiness: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
