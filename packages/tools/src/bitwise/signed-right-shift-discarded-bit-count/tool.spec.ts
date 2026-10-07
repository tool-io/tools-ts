import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("bitwise/signed-right-shift-discarded-bit-count", () => {
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
    expect(tool.execute({ signedInt32: -1, shiftCount: 3 })).toEqual({
      ok: true,
      output: { shiftedValue: -1, discardedOneBits: 3 },
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
    "rejects nonfinite signedInt32",
    (value) =>
      expect(tool.execute({ ...example.input, signedInt32: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite shiftCount", (value) =>
    expect(tool.execute({ ...example.input, shiftCount: value }).ok).toBe(
      false,
    ),
  );
  it.each([
    { signedInt32: -2147483649 },
    { signedInt32: 2147483648 },
    { shiftCount: -1 },
    { shiftCount: 32 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { signedInt32: -2147483649 },
    { signedInt32: 2147483648 },
    { shiftCount: -1 },
    { shiftCount: 32 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("reviewed boundary cases", () => {
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ signedInt32: -2147483648, shiftCount: 31 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { shiftedValue: -1, discardedOneBits: 0 },
    });
    expect(calculate(input)).toEqual({ shiftedValue: -1, discardedOneBits: 0 });
  });
  it("matches an independently reviewed edge fixture", () => {
    const input = {
      ...example.input,
      ...{ signedInt32: 2147483647, shiftCount: 31 },
    };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { shiftedValue: 0, discardedOneBits: 31 },
    });
    expect(calculate(input)).toEqual({ shiftedValue: 0, discardedOneBits: 31 });
  });
});
