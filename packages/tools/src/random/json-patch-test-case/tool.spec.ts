import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  jsonPatchTestCaseExample as example,
  calculateJsonPatchTestCase,
} from "./tool.js";

describe("Random JSON Patch Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateJsonPatchTestCase(example.input)).toEqual({
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
  it("has known independent removal/replacement/addition answers", () => {
    const result = tool.execute({
      caseCount: 1,
      beforeFields: [
        { key: "old", kind: "integer", minimum: 3, maximum: 3 },
        { key: "kept", kind: "text", choices: ["before"] },
      ],
      afterFields: [
        { key: "kept", kind: "text", choices: ["after"] },
        { key: "fresh", kind: "boolean", trueProbability: 1 },
      ],
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(JSON.parse(result.output.cases[0].patch)).toEqual([
      { op: "remove", path: "/old" },
      { op: "replace", path: "/kept", value: "after" },
      { op: "add", path: "/fresh", value: true },
    ]);
    expect(JSON.parse(result.output.cases[0].applied)).toEqual({
      kept: "after",
      fresh: true,
    });
  });
  it("compares structure rather than property insertion order and preserves no-op cases", () => {
    const fields = [
      { key: "x", kind: "integer", minimum: 7, maximum: 7 },
    ] as const;
    const result = tool.execute({
      caseCount: 2,
      beforeFields: fields,
      afterFields: fields,
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    for (const item of result.output.cases) {
      expect(item.patch).toBe("[]");
      expect(item.opCount).toBe(0);
      expect(JSON.parse(item.before)).toEqual(JSON.parse(item.after));
      expect(item.verified).toBe(true);
    }
    const many = tool.execute({ ...example.input, caseCount: 12 });
    if (!many.ok) throw new Error("Expected success");
    for (const item of many.output.cases) {
      expect(JSON.parse(item.applied)).toEqual(JSON.parse(item.after));
      expect(JSON.parse(item.patch)).toHaveLength(item.opCount);
    }
  });
  it("rejects unsafe path templates before invoking the inherited JSON cores", () => {
    expect(
      tool.execute({
        ...example.input,
        afterFields: [
          { key: "__proto__.polluted", kind: "boolean", trueProbability: 1 },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "afterFields", code: "unsafe_path_segment" }],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        beforeFields: [
          { key: "array.1", kind: "integer", minimum: 1, maximum: 2 },
        ],
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "beforeFields", code: "sparse_path_array" }] },
    });
    expect(Object.hasOwn(Object.prototype, "polluted")).toBe(false);
  });
});
