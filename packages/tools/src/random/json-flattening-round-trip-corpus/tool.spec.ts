import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  jsonFlatteningRoundTripCorpusExample as example,
  calculateJsonFlatteningRoundTripCorpus,
} from "./tool.js";

describe("Random JSON Flattening Round-Trip Corpus Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateJsonFlatteningRoundTripCorpus(example.input)).toEqual({
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
  it("performs both core transformations and retains independently known contiguous-array leaves", () => {
    const result = tool.execute({
      documentCount: 2,
      fields: [
        { key: "rows.0.name", kind: "text", choices: ["Ada"] },
        { key: "rows.1.name", kind: "text", choices: ["Grace"] },
        { key: "meta.active", kind: "boolean", trueProbability: 1 },
      ],
      indent: 2,
      seed: 42,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    for (const document of result.output.documents) {
      expect(document.original).toEqual({
        rows: [{ name: "Ada" }, { name: "Grace" }],
        meta: { active: true },
      });
      expect(document.flattened).toEqual({
        "rows.0.name": "Ada",
        "rows.1.name": "Grace",
        "meta.active": true,
      });
      expect(document.rebuilt).toEqual(document.original);
      expect(document.exactRoundTrip).toBe(true);
      expect(JSON.parse(document.originalPretty)).toEqual(document.original);
    }
  });
  it("retains the supported subset's collision, array, and prototype restrictions", () => {
    const base = { kind: "boolean", trueProbability: 1 } as const;
    for (const keys of [
      ["a", "a.b"],
      ["rows.1"],
      ["rows.0", "rows.named"],
      ["__proto__.polluted"],
      ["constructor.prototype.polluted"],
      ["bad\n"],
    ])
      expect(
        tool.execute({
          documentCount: 1,
          fields: keys.map((key) => ({ ...base, key })),
          indent: 2,
          seed: 42,
        }),
      ).toMatchObject({ ok: false });
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
    expect(tool.execute({ ...example.input, documentCount: 65 })).toMatchObject(
      { ok: false },
    );
  });
});
