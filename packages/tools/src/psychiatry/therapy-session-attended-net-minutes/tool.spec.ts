import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("psychiatry/therapy-session-attended-net-minutes", () => {
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
        scheduledMinutes: 45,
        lateMinutes: 0,
        earlyDepartureMinutes: 5,
        interruptionMinutes: 0,
        refundedMinutes: 0,
      }),
    ).toEqual({
      ok: true,
      output: {
        attendedMinutes: 40,
        billableMinutes: 40,
        attendanceFraction: 0.8888888888888888,
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
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite scheduledMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, scheduledMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite lateMinutes",
    (value) =>
      expect(tool.execute({ ...example.input, lateMinutes: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite earlyDepartureMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, earlyDepartureMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite interruptionMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, interruptionMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite refundedMinutes",
    (value) =>
      expect(
        tool.execute({ ...example.input, refundedMinutes: value }).ok,
      ).toBe(false),
  );
  it.each([
    { scheduledMinutes: 0 },
    { lateMinutes: -1 },
    { earlyDepartureMinutes: -1 },
    { interruptionMinutes: -1 },
    { refundedMinutes: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { scheduledMinutes: 0 },
    { lateMinutes: -1 },
    { earlyDepartureMinutes: -1 },
    { interruptionMinutes: -1 },
    { refundedMinutes: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
