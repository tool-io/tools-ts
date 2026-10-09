import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("ethnomusicology/rhythmic-cycle-beat-phase", () => {
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
    expect(tool.execute({ beatPosition: -1, beatsPerCycle: 4 })).toEqual({
      ok: true,
      output: { phaseBeats: 3, phaseFraction: 0.75 },
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
    "rejects nonfinite beatPosition",
    (value) =>
      expect(tool.execute({ ...example.input, beatPosition: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite beatsPerCycle",
    (value) =>
      expect(tool.execute({ ...example.input, beatsPerCycle: value }).ok).toBe(
        false,
      ),
  );
  it.each([{ beatsPerCycle: 0 }])(
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
  it.each([{ beatsPerCycle: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 77 reviewed regressions", () => {
  it("preserves a tiny positive phase", () => {
    expect(calculate({ beatPosition: 1e-20, beatsPerCycle: 8 })).toEqual({
      phaseBeats: 1e-20,
      phaseFraction: 1.25e-21,
    });
  });
  it("keeps rounded negative boundary values inside the cycle", () => {
    const output = calculate({
      beatPosition: -Number.MIN_VALUE,
      beatsPerCycle: 8,
    });
    expect(output.phaseBeats).toBeGreaterThanOrEqual(0);
    expect(output.phaseBeats).toBeLessThan(8);
  });
});
