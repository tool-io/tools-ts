import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("anesthesiology/anesthesia-log-artifact-exclusion-term", () => {
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
        totalSamples: 500,
        artifactSamples: 20,
        missingSamples: 30,
        overlappingExcluded: 0,
        sampleHz: 50,
      }),
    ).toEqual({
      ok: true,
      output: { excludedUnion: 50, eligibleSamples: 450, eligibleSeconds: 9 },
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
    "rejects nonfinite totalSamples",
    (value) =>
      expect(tool.execute({ ...example.input, totalSamples: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite artifactSamples",
    (value) =>
      expect(
        tool.execute({ ...example.input, artifactSamples: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite missingSamples",
    (value) =>
      expect(tool.execute({ ...example.input, missingSamples: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite overlappingExcluded",
    (value) =>
      expect(
        tool.execute({ ...example.input, overlappingExcluded: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sampleHz", (value) =>
    expect(tool.execute({ ...example.input, sampleHz: value }).ok).toBe(false),
  );
  it.each([
    { totalSamples: -1 },
    { artifactSamples: -1 },
    { missingSamples: -1 },
    { overlappingExcluded: -1 },
    { sampleHz: 0 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { totalSamples: -1 },
    { artifactSamples: -1 },
    { missingSamples: -1 },
    { overlappingExcluded: -1 },
    { sampleHz: 0 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
