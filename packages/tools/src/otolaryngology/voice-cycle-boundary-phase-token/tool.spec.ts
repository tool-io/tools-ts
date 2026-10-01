import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("otolaryngology/voice-cycle-boundary-phase-token", () => {
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
        sample: 20,
        cycleStart: 0,
        samplesPerCycle: 10,
        boundaryToNext: false,
      }),
    ).toEqual({ ok: true, output: { cycle: 1, phaseSamples: 10 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sample", (value) =>
    expect(tool.execute({ ...example.input, sample: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite cycleStart", (value) =>
    expect(tool.execute({ ...example.input, cycleStart: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite samplesPerCycle",
    (value) =>
      expect(
        tool.execute({ ...example.input, samplesPerCycle: value }).ok,
      ).toBe(false),
  );
  it.each([{ samplesPerCycle: 0 }])(
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
  it.each([{ samplesPerCycle: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 70 independent regressions", () => {
  it("assigns an exact negative-period boundary to the previous cycle", () => {
    expect(
      calculate({
        sample: -10,
        cycleStart: 0,
        samplesPerCycle: 10,
        boundaryToNext: false,
      }),
    ).toEqual({ cycle: -2, phaseSamples: 10 });
    expect(
      tool.execute({
        sample: -10,
        cycleStart: 0,
        samplesPerCycle: 10,
        boundaryToNext: false,
      }),
    ).toEqual({ ok: true, output: { cycle: -2, phaseSamples: 10 } });
  });
});
