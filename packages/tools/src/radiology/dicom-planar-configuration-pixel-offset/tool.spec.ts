import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("radiology/dicom-planar-configuration-pixel-offset", () => {
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
        pixelIndex: 4,
        sampleIndex: 1,
        pixelsPerFrame: 10,
        samplesPerPixel: 3,
        planar: true,
      }),
    ).toEqual({ ok: true, output: { elementOffset: 14 } });
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite pixelIndex", (value) =>
    expect(tool.execute({ ...example.input, pixelIndex: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite sampleIndex",
    (value) =>
      expect(tool.execute({ ...example.input, sampleIndex: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite pixelsPerFrame",
    (value) =>
      expect(tool.execute({ ...example.input, pixelsPerFrame: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite samplesPerPixel",
    (value) =>
      expect(
        tool.execute({ ...example.input, samplesPerPixel: value }).ok,
      ).toBe(false),
  );
  it.each([
    { pixelIndex: -1 },
    { sampleIndex: -1 },
    { pixelsPerFrame: 0 },
    { samplesPerPixel: 0 },
    { samplesPerPixel: 17 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { pixelIndex: -1 },
    { sampleIndex: -1 },
    { pixelsPerFrame: 0 },
    { samplesPerPixel: 0 },
    { samplesPerPixel: 17 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
