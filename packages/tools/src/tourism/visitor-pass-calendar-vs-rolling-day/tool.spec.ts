import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("tourism/visitor-pass-calendar-vs-rolling-day", () => {
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
    expect(tool.execute({ purchaseEpochSeconds: 0, validityDays: 1 })).toEqual({
      ok: true,
      output: {
        utcCalendarExpiryExclusiveSeconds: 86400,
        rollingExpiryExclusiveSeconds: 86400,
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
    "rejects nonfinite purchaseEpochSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, purchaseEpochSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite validityDays",
    (value) =>
      expect(tool.execute({ ...example.input, validityDays: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ validityDays: 0 }])(
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
  it.each([{ validityDays: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ purchaseEpochSeconds: -1, validityDays: 1 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        utcCalendarExpiryExclusiveSeconds: 0,
        rollingExpiryExclusiveSeconds: 86399,
      },
    });
    expect(calculate(input)).toEqual({
      utcCalendarExpiryExclusiveSeconds: 0,
      rollingExpiryExclusiveSeconds: 86399,
    });
  });
});
