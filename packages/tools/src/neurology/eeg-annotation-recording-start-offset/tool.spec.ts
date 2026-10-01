import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("neurology/eeg-annotation-recording-start-offset", () => {
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
        annotationSeconds: 20.005,
        recordingStartSeconds: 20,
        clockOffsetSeconds: 0,
        sampleHz: 100,
      }),
    ).toEqual({
      ok: true,
      output: {
        relativeSeconds: 0.004999999999999005,
        nearestSample: 0,
        sampleErrorSeconds: -0.004999999999999005,
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
    "rejects nonfinite annotationSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, annotationSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite recordingStartSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, recordingStartSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite clockOffsetSeconds",
    (value) =>
      expect(
        tool.execute({ ...example.input, clockOffsetSeconds: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sampleHz", (value) =>
    expect(tool.execute({ ...example.input, sampleHz: value }).ok).toBe(false),
  );
  it.each([{ sampleHz: 0 }])(
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
  it.each([{ sampleHz: 0 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 66 review regressions", () => {
  it("computes quantization error after removing a large absolute clock origin", () => {
    expect(
      calculate({
        annotationSeconds: 1000000000001,
        recordingStartSeconds: 1000000000000,
        clockOffsetSeconds: 0.1,
        sampleHz: 10,
      }),
    ).toEqual({
      relativeSeconds: 0.9,
      nearestSample: 9,
      sampleErrorSeconds: 0,
    });
  });
});
