import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("radiology/dicom-pixel-representation-signextension-mask", () => {
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
        word: 500,
        storedBits: 12,
        allocatedBits: 16,
        signed: false,
      }),
    ).toEqual({
      ok: true,
      output: { maskedWord: 500, interpretedValue: 500, extendedWord: 500 },
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite word", (value) =>
    expect(tool.execute({ ...example.input, word: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite storedBits", (value) =>
    expect(tool.execute({ ...example.input, storedBits: value }).ok).toBe(
      false,
    ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite allocatedBits",
    (value) =>
      expect(tool.execute({ ...example.input, allocatedBits: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { allocatedBits: 8, storedBits: 9 },
    { word: -1 },
    { storedBits: 0 },
    { storedBits: 33 },
    { allocatedBits: 33 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { allocatedBits: 8, storedBits: 9 },
    { word: -1 },
    { storedBits: 0 },
    { storedBits: 33 },
    { allocatedBits: 33 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("batch 66 review regressions", () => {
  it("interprets the full unsigned 32-bit word without signed bitwise coercion", () => {
    expect(
      calculate({
        word: 4294967295,
        storedBits: 32,
        allocatedBits: 32,
        signed: false,
      }),
    ).toEqual({
      maskedWord: 4294967295,
      interpretedValue: 4294967295,
      extendedWord: 4294967295,
    });
    expect(
      calculate({
        word: 4294967295,
        storedBits: 32,
        allocatedBits: 32,
        signed: true,
      }),
    ).toEqual({
      maskedWord: 4294967295,
      interpretedValue: -1,
      extendedWord: 4294967295,
    });
  });
  it("ignores unused high bits and sign-extends the stored sign bit", () => {
    expect(
      calculate({
        word: 61440,
        storedBits: 12,
        allocatedBits: 16,
        signed: true,
      }),
    ).toEqual({ maskedWord: 0, interpretedValue: 0, extendedWord: 0 });
    expect(
      calculate({
        word: 2048,
        storedBits: 12,
        allocatedBits: 16,
        signed: true,
      }),
    ).toEqual({
      maskedWord: 2048,
      interpretedValue: -2048,
      extendedWord: 63488,
    });
  });
});
