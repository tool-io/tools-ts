import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("computational-linguistics/token-byte-character-ratio", () => {
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
    expect(tool.execute({ token: "" })).toEqual({
      ok: true,
      output: { utf8Bytes: 0, codePoints: 0, ratio: 0, defined: false },
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
});

describe("batch 72 independent regressions", () => {
  it("documents portable replacement bytes for an isolated surrogate", () => {
    const input = { token: "\ud800" };
    expect(calculate(input)).toEqual({
      utf8Bytes: 3,
      codePoints: 1,
      ratio: 3,
      defined: true,
    });
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { utf8Bytes: 3, codePoints: 1, ratio: 3, defined: true },
    });
  });
});
