import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("encode/base32-zero-tail-padbit-writer", () => {
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
    expect(tool.execute({ significantValue: 7, significantBits: 3 })).toEqual({
      ok: true,
      output: { symbolValue: 28, zeroPadBits: 2 },
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
    "rejects nonfinite significantValue",
    (value) =>
      expect(
        tool.execute({ ...example.input, significantValue: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite significantBits",
    (value) =>
      expect(
        tool.execute({ ...example.input, significantBits: value }).ok,
      ).toBe(false),
  );
  it.each([
    { significantValue: 4 },
    { significantValue: -1 },
    { significantBits: 0 },
    { significantBits: 6 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { significantValue: 4 },
    { significantValue: -1 },
    { significantBits: 0 },
    { significantBits: 6 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});

describe("independently reviewed regressions", () => {
  it("one significant bit occupies the high position", () => {
    const output = calculate({ significantValue: 1, significantBits: 1 });
    expect(output).toMatchObject({ symbolValue: 16, zeroPadBits: 4 });
    expect(tool.execute({ significantValue: 1, significantBits: 1 })).toEqual({
      ok: true,
      output,
    });
  });
});
