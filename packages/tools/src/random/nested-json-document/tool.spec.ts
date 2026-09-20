import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  nestedJsonDocumentExample as example,
  calculateNestedJsonDocument,
} from "./tool.js";

describe("Random Nested JSON Document Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateNestedJsonDocument(example.input)).toEqual({
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
  it("rebuilds independently known nested arrays and keeps per-document field answers", () => {
    const result = tool.execute({
      documentCount: 1,
      fields: [
        { key: "profile.name", kind: "text", choices: ["Ada"] },
        { key: "rows.1.value", kind: "integer", minimum: 7, maximum: 7 },
        { key: "rows.0.value", kind: "boolean", trueProbability: 1 },
      ],
      indent: 2,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.documents[0].document).toEqual({
      profile: { name: "Ada" },
      rows: [{ value: true }, { value: 7 }],
    });
    expect(JSON.parse(result.output.documents[0].pretty)).toEqual(
      result.output.documents[0].document,
    );
    expect(result.output.documents[0].pretty.endsWith("\n")).toBe(true);
  });
  it("rejects collisions, sparse/mixed containers and inherited keys before touching object prototypes", () => {
    const base = { kind: "boolean", trueProbability: 1 } as const;
    for (const [keys, code] of [
      [["a", "a.b"], "path_conflict"],
      [["rows.1"], "sparse_path_array"],
      [["rows.0", "rows.name"], "mixed_path_container"],
      [["__proto__.polluted"], "unsafe_path_segment"],
      [["constructor.prototype.polluted"], "unsafe_path_segment"],
      [["toString.value"], "unsafe_path_segment"],
      [["a\n"], "unsupported_path_segment"],
      [["0.name"], "unsupported_path_segment"],
      [["rows.0", "rows.1\n"], "unsupported_path_segment"],
    ] as const)
      expect(
        tool.execute({
          documentCount: 1,
          fields: keys.map((key) => ({ ...base, key })),
          indent: 2,
          seed: 42,
        }),
      ).toMatchObject({
        ok: false,
        error: { issues: [{ field: "fields", code }] },
      });
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
    expect(
      tool.execute({
        ...example.input,
        fields: [{ key: "a.b.c.d.e.f.g.h.i", ...base }],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "fields", code: "path_depth_limit" }] },
    });
  });
});
