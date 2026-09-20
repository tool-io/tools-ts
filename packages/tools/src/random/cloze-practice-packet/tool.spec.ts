import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  clozePracticePacketExample as example,
  calculateClozePracticePacket,
} from "./tool.js";

describe("Random Cloze Practice Packet Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateClozePracticePacket(example.input)).toEqual({
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
  it("preserves punctuation, Unicode words and contracted/hyphenated word keys", () => {
    const result = tool.execute({
      passages: ["L'été, co-op — 你好 42!"],
      minimumInterval: 1,
      maximumInterval: 1,
      count: 1,
      seed: 7,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        exercises: [
          {
            clozePassage: "____, ____ — ____ ____!",
            deletedWords: ["L'été", "co-op", "你好", "42"],
          },
        ],
      },
    });
  });
  it("retains no-deletion outcomes when a drawn offset lies beyond the final word", () => {
    const result = tool.execute(
      { passages: ["Hi!"], minimumInterval: 10, maximumInterval: 10, count: 1 },
      { random: () => 0.99 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        exercises: [
          { firstDeletionOrdinal: 10, clozePassage: "Hi!", deletedWords: [] },
        ],
      },
    });
  });
  it("validates every supplied passage before drawing and rejects invalid intervals", () => {
    for (const change of [
      { passages: ["Words.", "?!"] },
      { minimumInterval: 5 },
      { maximumInterval: 129 },
      { count: 33 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
