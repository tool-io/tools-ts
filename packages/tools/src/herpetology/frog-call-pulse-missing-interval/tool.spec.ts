import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("herpetology/frog-call-pulse-missing-interval", () => {
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
        observedPulses: 8,
        expectedSlots: 12,
        uncertainSlots: 2,
        includeUncertain: true,
      }),
    ).toEqual({
      ok: true,
      output: {
        denominator: 12,
        missingSlots: 4,
        coverage: 0.6666666666666666,
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
    "rejects nonfinite observedPulses",
    (value) =>
      expect(tool.execute({ ...example.input, observedPulses: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite expectedSlots",
    (value) =>
      expect(tool.execute({ ...example.input, expectedSlots: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite uncertainSlots",
    (value) =>
      expect(tool.execute({ ...example.input, uncertainSlots: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { observedPulses: 13 },
    { observedPulses: -1 },
    { expectedSlots: 0 },
    { uncertainSlots: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { observedPulses: 13 },
    { observedPulses: -1 },
    { expectedSlots: 0 },
    { uncertainSlots: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 70 independent regressions", () => {
  it("allows all slots uncertain when included", () => {
    expect(
      calculate({
        observedPulses: 0,
        expectedSlots: 12,
        uncertainSlots: 12,
        includeUncertain: true,
      }),
    ).toEqual({ denominator: 12, missingSlots: 12, coverage: 0 });
    expect(
      tool.execute({
        observedPulses: 0,
        expectedSlots: 12,
        uncertainSlots: 12,
        includeUncertain: true,
      }),
    ).toEqual({
      ok: true,
      output: { denominator: 12, missingSlots: 12, coverage: 0 },
    });
  });
});
