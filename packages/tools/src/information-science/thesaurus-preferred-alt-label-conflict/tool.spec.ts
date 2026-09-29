import { describe, it, expect } from "vitest";
import tool, { calculate, example, inputSchema, outputSchema } from "./tool.js";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
describe("information-science/thesaurus-preferred-alt-label-conflict", () => {
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
        preferred: ["color", "colour"],
        alternative: [],
        languages: ["EN", "en"],
        alternativeLanguages: [],
      }),
    ).toEqual({
      ok: true,
      output: { conflicts: [], duplicatePreferredLanguages: ["en"] },
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

  it.each([{ alternativeLanguages: [] }, { languages: ["en"] }])(
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
  it.each([{ alternativeLanguages: [] }, { languages: ["en"] }])(
    "rejects a documented invalid domain before returning %j",
    (change) => {
      expect(() => calculate({ ...example.input, ...change })).toThrowError(
        SimpleToolError,
      );
    },
  );
});

describe("batch 66 review regressions", () => {
  it("allows the same lexical label in different languages", () => {
    expect(
      calculate({
        preferred: ["love"],
        languages: ["en"],
        alternative: ["love"],
        alternativeLanguages: ["en-GB"],
      }),
    ).toEqual({ conflicts: [], duplicatePreferredLanguages: [] });
  });
  it("deduplicates an identical repeated preferred literal", () => {
    expect(
      calculate({
        preferred: ["color", "color"],
        languages: ["en", "EN"],
        alternative: [],
        alternativeLanguages: [],
      }),
    ).toEqual({ conflicts: [], duplicatePreferredLanguages: [] });
  });
  it("matches disjointness using both lexical text and case-insensitive language", () => {
    expect(
      calculate({
        preferred: ["cat"],
        languages: ["EN"],
        alternative: ["cat"],
        alternativeLanguages: ["en"],
      }),
    ).toEqual({ conflicts: ["cat"], duplicatePreferredLanguages: [] });
  });
});
