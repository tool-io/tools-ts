import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  htmlAttributeQuotingCorpusExample as example,
  calculateHtmlAttributeQuotingCorpus,
} from "./tool.js";

describe("Random HTML Attribute Quoting Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateHtmlAttributeQuotingCorpus(example.input)).toEqual({
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
  it("retains escaped raw references, selected quote styles, and first duplicate attributes", () => {
    for (const style of ["double", "single", "unquoted"]) {
      const result = tool.execute({
        ...example.input,
        styles: [style],
        caseCount: 12,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const entry of result.output.cases) {
        const first = new Map<string, string>();
        for (const attribute of entry.sourceAttributes) {
          expect(attribute.style).toBe(style);
          if (!first.has(attribute.name.toLowerCase()))
            first.set(attribute.name.toLowerCase(), attribute.encodedValue);
        }
        expect(entry.parsed.attributes).toEqual(
          [...first].map(([name, value]) => ({ name, value })),
        );
        expect(
          entry.sourceAttributes.some((attribute) =>
            attribute.encodedValue.includes("&"),
          ),
        ).toBe(true);
      }
    }
  });
  it("supports Boolean and no-attribute controls while preserving Unicode input separately", () => {
    expect(
      tool.execute({
        ...example.input,
        values: [""],
        styles: ["boolean"],
        attributeNames: ["disabled"],
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          { parsed: { attributes: [{ name: "disabled", value: "" }] } },
          { parsed: { attributes: [{ name: "disabled", value: "" }] } },
        ],
      },
    });
    expect(
      tool.execute({ ...example.input, attributesPerTag: 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          { sourceAttributes: [], parsed: { attributes: [] } },
          { sourceAttributes: [], parsed: { attributes: [] } },
        ],
      },
    });
    const unicode = tool.execute({
      ...example.input,
      values: ["😀 café"],
      styles: ["double"],
    });
    expect(unicode.ok).toBe(true);
    if (unicode.ok)
      expect(unicode.output.cases[0].sourceAttributes[0].inputValue).toBe(
        "😀 café",
      );
  });
  it("rejects impossible style/value combinations, executable attribute names, controls, and resource excess", () => {
    for (const change of [
      { values: ["a b"], styles: ["unquoted"] },
      { values: ["x"], styles: ["boolean"] },
      { values: [""], styles: ["unquoted"] },
      { values: ["bad\n"] },
      { attributeNames: ["onclick"] },
      { tagNames: ["script"] },
      { attributesPerTag: 9 },
      { caseCount: 33 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
