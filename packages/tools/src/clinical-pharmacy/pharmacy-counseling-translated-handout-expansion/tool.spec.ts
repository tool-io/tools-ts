import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("clinical-pharmacy/pharmacy-counseling-translated-handout-expansion", () => {
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
        sourceWords: 600,
        expansionFactor: 1.1,
        wordsPerPage: 400,
        languages: 2,
        copiesPerLanguage: 5,
      }),
    ).toEqual({
      ok: true,
      output: { translatedWords: 660, pagesPerCopy: 2, totalPages: 20 },
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
    "rejects nonfinite sourceWords",
    (value) =>
      expect(tool.execute({ ...example.input, sourceWords: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite expansionFactor",
    (value) =>
      expect(
        tool.execute({ ...example.input, expansionFactor: value }).ok,
      ).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite wordsPerPage",
    (value) =>
      expect(tool.execute({ ...example.input, wordsPerPage: value }).ok).toBe(
        false,
      ),
  );
  it.each([NaN, Infinity, -Infinity])("rejects nonfinite languages", (value) =>
    expect(tool.execute({ ...example.input, languages: value }).ok).toBe(false),
  );
  it.each([NaN, Infinity, -Infinity])(
    "rejects nonfinite copiesPerLanguage",
    (value) =>
      expect(
        tool.execute({ ...example.input, copiesPerLanguage: value }).ok,
      ).toBe(false),
  );
  it.each([
    { sourceWords: -1 },
    { expansionFactor: 0 },
    { wordsPerPage: 0 },
    { languages: -1 },
    { copiesPerLanguage: -1 },
  ])("rejects documented invalid domains %j", (change) => {
    const r = tool.execute({ ...example.input, ...change });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe("invalid_input");
  });
});

import { SimpleToolError } from "../../core/simple.js";
describe("direct calculation domain validation", () => {
  it.each([
    { sourceWords: -1 },
    { expansionFactor: 0 },
    { wordsPerPage: 0 },
    { languages: -1 },
    { copiesPerLanguage: -1 },
  ])("rejects a documented invalid domain before returning %j", (change) => {
    expect(() => calculate({ ...example.input, ...change })).toThrowError(
      SimpleToolError,
    );
  });
});
