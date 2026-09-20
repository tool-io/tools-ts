import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  httpCookieRoundTripCorpusExample as example,
  calculateHttpCookieRoundTripCorpus,
} from "./tool.js";

describe("Random HTTP Cookie Round-Trip Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateHttpCookieRoundTripCorpus(example.input)).toEqual({
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
  it("preserves pair order, duplicate names, encoded values, and supported format round trips", () => {
    for (const format of ["canonical", "quoted", "compact", "spaced"]) {
      const result = tool.execute({
        ...example.input,
        formats: [format],
        caseCount: 12,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      for (const entry of result.output.cases) {
        expect(entry.parsed).toEqual(entry.pairs);
        expect(entry.pairs).toHaveLength(3);
        expect(entry.duplicateNames.length).toBeGreaterThan(0);
        expect(entry.header).not.toMatch(/[\r\n\x00]/);
        expect(entry.format).toBe(format);
        expect(
          entry.pairs.every((pair) => ["x", "%20", ""].includes(pair.value)),
        ).toBe(true);
      }
    }
  });
  it("supports distinct-name headers and zero-pair parser controls", () => {
    const unique = tool.execute({
      ...example.input,
      pairsPerHeader: 2,
      duplicateNames: "forbid",
    });
    expect(unique.ok).toBe(true);
    if (unique.ok)
      for (const entry of unique.output.cases) {
        expect(entry.duplicateNames).toEqual([]);
        expect(new Set(entry.pairs.map((pair) => pair.name)).size).toBe(2);
      }
    expect(
      tool.execute({
        ...example.input,
        pairsPerHeader: 0,
        duplicateNames: "allow",
      }),
    ).toMatchObject({
      ok: true,
      output: {
        cases: [
          { pairs: [], parsed: [], duplicateNames: [] },
          { pairs: [], parsed: [], duplicateNames: [] },
        ],
      },
    });
  });
  it("rejects invalid octets and controls even in unselected fragments, plus impossible/resource choices", () => {
    for (const change of [
      { names: ["good", "bad\n"] },
      { names: ["a b"] },
      { values: ["good", "bad\n"] },
      { values: ["a;b"] },
      { values: ["a,b"] },
      { values: ['"quoted"'] },
      { values: ["é"] },
      { pairsPerHeader: 1 },
      { duplicateNames: "forbid", pairsPerHeader: 3 },
      { caseCount: 33 },
      { formats: ["unknown"] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
