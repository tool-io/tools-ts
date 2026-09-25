import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("decode/base64-sextet-padding-mask", () => {
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
    expect(tool.execute({ sextet: 19, finalOfOneByte: true })).toEqual({
      ok: true,
      output: {
        unusedBitCount: 4,
        mask: 15,
        unusedValue: 3,
        canonicalPadBits: false,
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
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite sextet", (value) =>
    expect(tool.execute({ ...example.input, sextet: value }).ok).toBe(false),
  );
  it.each([{ sextet: -1 }, { sextet: 64 }])(
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
  it.each([{ sextet: -1 }, { sextet: 64 }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 72 independent regressions", () => {
  it("checks the two low bits for a two-byte tail", () => {
    const input = { sextet: 61, finalOfOneByte: false };
    expect(calculate(input)).toEqual({
      unusedBitCount: 2,
      mask: 3,
      unusedValue: 1,
      canonicalPadBits: false,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: {
        unusedBitCount: 2,
        mask: 3,
        unusedValue: 1,
        canonicalPadBits: false,
      },
    });
  });
});
