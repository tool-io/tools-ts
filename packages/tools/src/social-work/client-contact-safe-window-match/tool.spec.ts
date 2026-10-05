import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("social-work/client-contact-safe-window-match", () => {
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
        minuteOfDay: 60,
        safeStartMinute: 1320,
        safeEndMinute: 120,
      }),
    ).toEqual({ ok: true, output: { withinRecordedWindow: true } });
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
    "rejects nonfinite minuteOfDay",
    (value) =>
      expect(tool.execute({ ...example.input, minuteOfDay: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite safeStartMinute",
    (value) =>
      expect(
        tool.execute({ ...example.input, safeStartMinute: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite safeEndMinute",
    (value) =>
      expect(tool.execute({ ...example.input, safeEndMinute: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { minuteOfDay: -1 },
    { minuteOfDay: 1440 },
    { safeStartMinute: -1 },
    { safeStartMinute: 1440 },
    { safeEndMinute: -1 },
    { safeEndMinute: 1441 },
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
    { safeStartMinute: -1 },
    { safeStartMinute: 1440 },
    { safeEndMinute: -1 },
    { safeEndMinute: 1441 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
