import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("decode/base32-last-symbol-padbits", () => {
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
    expect(tool.execute({ symbolValue: 17, byteRemainder: 1 })).toEqual({
      ok: true,
      output: { unusedBits: 2, unusedValue: 1, canonical: false },
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
    "rejects nonfinite symbolValue",
    (value) =>
      expect(tool.execute({ ...example.input, symbolValue: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite byteRemainder",
    (value) =>
      expect(tool.execute({ ...example.input, byteRemainder: value }).ok).toBe(
        false,
      ),
  );
  it.each([
    { symbolValue: -1 },
    { symbolValue: 32 },
    { byteRemainder: -1 },
    { byteRemainder: 5 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { symbolValue: -1 },
    { symbolValue: 32 },
    { byteRemainder: -1 },
    { byteRemainder: 5 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("two input bytes leave four unused final-symbol bits", () => {
    const output = calculate({ symbolValue: 16, byteRemainder: 2 });
    expect(output).toMatchObject({
      unusedBits: 4,
      unusedValue: 0,
      canonical: true,
    });
    expect(tool.execute({ symbolValue: 16, byteRemainder: 2 })).toEqual({
      ok: true,
      output,
    });
  });
  it("three input bytes leave one unused final-symbol bit", () => {
    const output = calculate({ symbolValue: 3, byteRemainder: 3 });
    expect(output).toMatchObject({
      unusedBits: 1,
      unusedValue: 1,
      canonical: false,
    });
    expect(tool.execute({ symbolValue: 3, byteRemainder: 3 })).toEqual({
      ok: true,
      output,
    });
  });
});
