import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("atmospheric-physics/radar-nyquist-velocity-interval", () => {
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
      tool.execute({ wavelength: 0.04, pulseRepetitionFrequency: 500 }),
    ).toEqual({
      ok: true,
      output: { nyquistSpeed: 5, lowerInclusive: -5, upperExclusive: 5 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite wavelength", (value) =>
    expect(tool.execute({ ...example.input, wavelength: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pulseRepetitionFrequency",
    (value) =>
      expect(
        tool.execute({ ...example.input, pulseRepetitionFrequency: value }).ok,
      ).toBe(false),
  );
  it.each([{ wavelength: 0 }, { pulseRepetitionFrequency: 0 }])(
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
  it.each([{ wavelength: 0 }, { pulseRepetitionFrequency: 0 }])(
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
      ...{ wavelength: 0.1, pulseRepetitionFrequency: 1000 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { nyquistSpeed: 25, lowerInclusive: -25, upperExclusive: 25 },
    });
    expect(calculate(input)).toEqual({
      nyquistSpeed: 25,
      lowerInclusive: -25,
      upperExclusive: 25,
    });
  });
});
