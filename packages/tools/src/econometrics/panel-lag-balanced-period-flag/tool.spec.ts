import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("econometrics/panel-lag-balanced-period-flag", () => {
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
      tool.execute({ previousPeriod: 4, currentPeriod: 6, requiredLag: 1 }),
    ).toEqual({ ok: true, output: { lagAligned: false, actualLag: 2 } });
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
    "rejects nonfinite previousPeriod",
    (value) =>
      expect(tool.execute({ ...example.input, previousPeriod: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite currentPeriod",
    (value) =>
      expect(tool.execute({ ...example.input, currentPeriod: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite requiredLag",
    (value) =>
      expect(tool.execute({ ...example.input, requiredLag: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ requiredLag: -1 }])(
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
  it.each([{ requiredLag: -1 }])(
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
      ...{ previousPeriod: -1, currentPeriod: 1, requiredLag: 2 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { lagAligned: true, actualLag: 2 },
    });
    expect(calculate(input)).toEqual({ lagAligned: true, actualLag: 2 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = {
      ...example.input,
      ...{ previousPeriod: -9007199254740991, currentPeriod: 9007199254740991 },
    };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "", code: "result_out_of_range" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
