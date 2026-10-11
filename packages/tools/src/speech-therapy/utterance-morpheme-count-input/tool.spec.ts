import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("speech-therapy/utterance-morpheme-count-input", () => {
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
      tool.execute({ utteranceId: "U18", suppliedMorphemeCounts: [] }),
    ).toEqual({ ok: true, output: { totalMorphemes: 0, countedWords: 0 } });
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

describe("nested finite suppliedMorphemeCounts validation", () => {
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite array data",
    (value) => {
      const input = { ...example.input, suppliedMorphemeCounts: [value] };
      expect(tool.execute(input)).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ code: "invalid_field", field: "suppliedMorphemeCounts" }],
        },
      });
    },
  );
});

describe("reviewed boundary cases", () => {
  it.each(["utteranceId"])(
    "rejects empty required text with its field",
    (field) => {
      const result = tool.execute({ ...example.input, [field]: "" });
      expect(result).toMatchObject({
        ok: false,
        error: {
          code: "invalid_input",
          issues: [{ field, code: "invalid_field" }],
        },
      });
    },
  );
  it("matches an independently reviewed edge fixture", () => {
    const input = { ...example.input, ...{ suppliedMorphemeCounts: [] } };
    expect(tool.execute(input)).toEqual({
      ok: true,
      output: { totalMorphemes: 0, countedWords: 0 },
    });
    expect(calculate(input)).toEqual({ totalMorphemes: 0, countedWords: 0 });
  });
  it("rejects an explicit domain boundary with stable field", () => {
    const input = { ...example.input, ...{ suppliedMorphemeCounts: [1, -1] } };
    expect(tool.execute(input)).toMatchObject({
      ok: false,
      error: {
        code: "invalid_input",
        issues: [{ field: "suppliedMorphemeCounts", code: "invalid_domain" }],
      },
    });
    expect(() => calculate(input)).toThrow();
  });
});
