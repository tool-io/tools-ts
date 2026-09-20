import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  wordWrapBoundaryCorpusExample as example,
  calculateWordWrapBoundaryCorpus,
} from "./tool.js";

describe("Random Word Wrap Boundary Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateWordWrapBoundaryCorpus(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("is immutable and reproducible, with explicit seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(input)).toEqual(tool.execute(example.input));
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = example.input;
    expect(tool.execute(unseeded)).toEqual(tool.execute(unseeded));
  });
  it("rejects invalid or failing injected sources", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
  });
  it("rejects malformed data without coercion", () => {
    expect(tool.execute(null)).toMatchObject({ ok: false });
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
    });
  });
  it("preserves tokens while exposing long-word failures rather than dropping cases", () => {
    const result = tool.execute({
      ...example.input,
      words: ["unbreakable"],
      minimumWidth: 3,
      maximumWidth: 3,
      wordCount: 2,
      count: 1,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            text: expect.any(String),
            width: 3,
            wrapped: { wrappedText: "unbreakable\nunbreakable", lineCount: 2 },
            justified: { ok: false, text: null, errorCode: "invalid_value" },
          },
        ],
      },
    });
  });
  it("keeps paragraph breaks distinct from ordinary wrapping whitespace", () => {
    const result = tool.execute({
      words: ["one"],
      separators: ["\n\n"],
      wordCount: 3,
      minimumWidth: 12,
      maximumWidth: 12,
      count: 1,
      seed: 1,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            text: "one\n\none\n\none",
            wrapped: { wrappedText: "one one one", lineCount: 1 },
            justified: {
              ok: true,
              text: "one\n\none\n\none",
              errorCode: null,
              errorMessage: null,
            },
          },
        ],
      },
    });
  });
  it("distinguishes width six from the exact seven-character two-word boundary", () => {
    const input = {
      words: ["two"],
      separators: [" "],
      wordCount: 3,
      count: 1,
      seed: 42,
    };
    const narrow = tool.execute({ ...input, minimumWidth: 6, maximumWidth: 6 });
    const exact = tool.execute({ ...input, minimumWidth: 7, maximumWidth: 7 });
    expect(narrow).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            width: 6,
            text: "two two two",
            wrapped: { wrappedText: "two\ntwo\ntwo", lineCount: 3 },
            justified: { ok: true, text: "two\ntwo\ntwo" },
          },
        ],
      },
    });
    expect(exact).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            width: 7,
            text: "two two two",
            wrapped: { wrappedText: "two two\ntwo", lineCount: 2 },
            justified: { ok: true, text: "two two\ntwo" },
          },
        ],
      },
    });
  });
  it("uses exact printable ASCII tokens and supported separators", () => {
    for (const change of [
      { words: ["two words"] },
      { words: ["é"] },
      { words: ["word\n"] },
      { separators: ["x"] },
      { minimumWidth: 13 },
      { count: 33 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
