import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-biology/sequence-kmer-edge-loss", () => {
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
        sequenceLength: 2,
        k: 3,
        clippedLeft: 0,
        clippedRight: 0,
      }),
    ).toEqual({
      ok: true,
      output: { originalWindows: 0, retainedWindows: 0, lostWindows: 0 },
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
    "rejects nonfinite sequenceLength",
    (value) =>
      expect(tool.execute({ ...example.input, sequenceLength: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite k", (value) =>
    expect(tool.execute({ ...example.input, k: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite clippedLeft",
    (value) =>
      expect(tool.execute({ ...example.input, clippedLeft: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite clippedRight",
    (value) =>
      expect(tool.execute({ ...example.input, clippedRight: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { sequenceLength: -1 },
    { k: 0 },
    { clippedLeft: -1 },
    { clippedRight: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { sequenceLength: -1 },
    { k: 0 },
    { clippedLeft: -1 },
    { clippedRight: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 71 independent regressions", () => {
  it("preserves zero windows for an empty sequence", () => {
    expect(
      calculate({ sequenceLength: 0, k: 3, clippedLeft: 0, clippedRight: 0 }),
    ).toEqual({ originalWindows: 0, retainedWindows: 0, lostWindows: 0 });
    expect(
      tool.execute({
        sequenceLength: 0,
        k: 3,
        clippedLeft: 0,
        clippedRight: 0,
      }),
    ).toEqual({
      ok: true,
      output: { originalWindows: 0, retainedWindows: 0, lostWindows: 0 },
    });
  });
});
