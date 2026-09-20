import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  subtitleTimingPracticeSetExample as example,
  calculateSubtitleTimingPracticeSet,
} from "./tool.js";

describe("Random Subtitle Timing Practice Set Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSubtitleTimingPracticeSet(example.input)).toEqual({
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
  it("distinguishes code points, whitespace and combining marks explicitly", () => {
    for (const [characterMode, characterCount] of [
      ["include-whitespace", 7],
      ["exclude-whitespace", 4],
    ] as const) {
      const result = tool.execute({
        ...example.input,
        captions: ["A 😀 e\u0301\n"],
        minimumMilliseconds: 2000,
        maximumMilliseconds: 2000,
        count: 1,
        characterMode,
      });
      expect(result).toMatchObject({
        ok: true,
        output: {
          cases: [
            {
              characterCount,
              wordCount: 3,
              durationSeconds: 2,
              charactersPerSecond: characterCount / 2,
              wordsPerMinute: 90,
            },
          ],
        },
      });
    }
  });
  it("keeps empty captions and equality at the caller's limit as non-exceeding", () => {
    expect(
      tool.execute({
        ...example.input,
        captions: [""],
        count: 1,
        characterLimit: 0,
        wordLimit: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          {
            characterCount: 0,
            wordCount: 0,
            charactersPerSecond: 0,
            wordsPerMinute: 0,
            exceedsCharacterLimit: false,
            exceedsWordLimit: false,
          },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        captions: ["Hi"],
        minimumMilliseconds: 1000,
        maximumMilliseconds: 1000,
        count: 1,
        characterLimit: 2,
        wordLimit: 60,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [{ exceedsCharacterLimit: false, exceedsWordLimit: false }],
      },
    });
  });
  it("rejects invalid durations, unsupported counting modes and limits", () => {
    for (const change of [
      { minimumMilliseconds: 0 },
      { minimumMilliseconds: 3001 },
      { characterMode: "graphemes" },
      { wordLimit: -1 },
      { count: 65 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
