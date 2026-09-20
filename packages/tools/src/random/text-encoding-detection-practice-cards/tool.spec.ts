import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  textEncodingDetectionPracticeCardsExample as example,
  calculateTextEncodingDetectionPracticeCards,
} from "./tool.js";

describe("Random Text Encoding Detection Practice Cards Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateTextEncodingDetectionPracticeCards(example.input)).toEqual({
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
  it("accepts multiple bank explanations, including different source messages", () => {
    const result = tool.execute(
      {
        messages: ["foo", "Zm9v"],
        encodings: ["base64", "html-entities"],
        count: 1,
        withoutReplacement: false,
      },
      { random: () => 0 },
    );
    expect(result).toMatchObject({
      ok: true,
      output: {
        cards: [
          {
            display: "Zm9v",
            generatedEncoding: "base64",
            sourceText: "foo",
            acceptedLabels: ["base64", "html-entities"],
            matchingSources: [
              { encoding: "base64", text: "foo" },
              { encoding: "html-entities", text: "Zm9v" },
            ],
            uniqueWithinSuppliedBank: false,
          },
        ],
      },
    });
  });
  it("distinguishes no repeated source/encoding pairs from repeated visual prompts", () => {
    const result = tool.execute({
      ...example.input,
      count: 8,
      withoutReplacement: true,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(
      new Set(
        result.output.cards.map((card) =>
          JSON.stringify([card.sourceText, card.generatedEncoding]),
        ),
      ).size,
    ).toBe(8);
    expect(new Set(result.output.cards.map((card) => card.display)).size).toBe(
      5,
    );
    for (const card of result.output.cards)
      expect(card.acceptedLabels).toContain(card.generatedEncoding);
    const unicode = tool.execute({
      ...example.input,
      messages: ["😀 café"],
      count: 4,
      withoutReplacement: true,
    });
    expect(unicode.ok).toBe(true);
    if (unicode.ok)
      expect(
        unicode.output.cards.every((card) => card.sourceText === "😀 café"),
      ).toBe(true);
  });
  it("rejects repeated source choices, unsupported codecs, ill-formed Unicode, and resource/impossible counts", () => {
    for (const change of [
      { messages: ["x", "x"] },
      { messages: ["\ud800"] },
      { encodings: ["hex"] },
      { encodings: ["base64", "base64"] },
      { count: 9, withoutReplacement: true },
      { count: 33 },
      { messages: ["x".repeat(257)] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
