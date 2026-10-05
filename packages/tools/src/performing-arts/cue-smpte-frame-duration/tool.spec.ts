import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("performing-arts/cue-smpte-frame-duration", () => {
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
        startFrame: 0,
        endFrame: 48,
        frameRateNumerator: 24,
        frameRateDenominator: 1,
      }),
    ).toEqual({ ok: true, output: { durationFrames: 48, seconds: 2 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite startFrame", (value) =>
    expect(tool.execute({ ...example.input, startFrame: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite endFrame", (value) =>
    expect(tool.execute({ ...example.input, endFrame: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite frameRateNumerator",
    (value) =>
      expect(
        tool.execute({ ...example.input, frameRateNumerator: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite frameRateDenominator",
    (value) =>
      expect(
        tool.execute({ ...example.input, frameRateDenominator: value }).ok,
      ).toBe(false),
  );
  it.each([
    { startFrame: -1 },
    { frameRateNumerator: 0 },
    { frameRateNumerator: 120001 },
    { frameRateDenominator: 0 },
    { frameRateDenominator: 10001 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { startFrame: -1 },
    { frameRateNumerator: 0 },
    { frameRateNumerator: 120001 },
    { frameRateDenominator: 0 },
    { frameRateDenominator: 10001 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
