import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  htmlTextExtractionCorpusExample as example,
  calculateHtmlTextExtractionCorpus,
} from "./tool.js";

describe("Random HTML Text Extraction Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateHtmlTextExtractionCorpus(example.input)).toEqual({
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
  it("distinguishes decoded visible text, raw stripped text, and comment-removed source", () => {
    const result = tool.execute({
      ...example.input,
      kinds: [
        "paragraph",
        "span",
        "emphasis",
        "comment",
        "inert-script",
        "style-comment",
      ],
      texts: ["A&B", 'x<y "quoted"', "😀 café", "*/ --", ""],
      caseCount: 12,
      fragmentsPerCase: 16,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const entry of result.output.cases) {
      expect(entry.html).toBe(
        entry.fragments.map((fragment) => fragment.source).join(""),
      );
      expect(entry.extractedText).toBe(
        entry.fragments
          .filter((fragment) =>
            ["paragraph", "span", "emphasis"].includes(fragment.kind),
          )
          .map((fragment) => fragment.text)
          .join(""),
      );
      expect(entry.tagStrippedText).toBe(
        entry.fragments
          .filter((fragment) => fragment.kind !== "comment")
          .map((fragment) => fragment.body)
          .join(""),
      );
      expect(entry.commentsRemovedHtml).toBe(
        entry.fragments
          .filter((fragment) => fragment.kind !== "comment")
          .map((fragment) => fragment.source)
          .join(""),
      );
    }
  });
  it("retains explicit hidden-source and all-comment controls without executing content", () => {
    expect(
      tool.execute({ ...example.input, kinds: ["comment"] }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          { extractedText: "", tagStrippedText: "", commentsRemovedHtml: "" },
        ],
      },
    });
    const hidden = tool.execute({
      ...example.input,
      kinds: ["inert-script"],
      texts: ["not executable </script> text"],
    });
    expect(hidden.ok).toBe(true);
    if (hidden.ok) {
      expect(hidden.output.cases[0].extractedText).toBe("");
      expect(hidden.output.cases[0].tagStrippedText).toContain(
        "&lt;/script&gt;",
      );
    }
  });
  it("rejects unsupported fragment kinds, controls, and resource excess", () => {
    for (const change of [
      { texts: ["bad\u0000"] },
      { kinds: ["iframe"] },
      { kinds: ["span", "span"] },
      { fragmentsPerCase: 17 },
      { caseCount: 17 },
      { texts: ["x".repeat(65)] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
