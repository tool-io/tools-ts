import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  minHashSimilarityWorkloadExample as example,
  calculateMinHashSimilarityWorkload,
} from "./tool.js";

describe("Random MinHash Similarity Workload Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateMinHashSimilarityWorkload(example.input)).toEqual({
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
  it("retains exact requested overlap and estimates from signature-match fractions", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        universe: Array.from({ length: 30 }, (_, i) => "item-" + i),
        leftCount: 12,
        rightCount: 15,
        sharedCount: 5,
        hashCount: 32,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const { left, right, intersection, union } = result.output.sets;
      expect(new Set(left).size).toBe(12);
      expect(new Set(right).size).toBe(15);
      expect(left.filter((value) => right.includes(value))).toEqual(
        intersection,
      );
      expect(intersection).toHaveLength(5);
      expect(new Set([...left, ...right]).size).toBe(22);
      expect(union).toHaveLength(22);
      expect(result.output.similarity.exactJaccard).toBe(5 / 22);
      expect(result.output.similarity.estimatedJaccard).toBe(
        result.output.signatures.left.filter(
          (hash, i) => hash === result.output.signatures.right[i],
        ).length / 32,
      );
    }
  });
  it("preserves identical-set and empty-set conventions", () => {
    expect(
      tool.execute({
        ...example.input,
        leftCount: 2,
        rightCount: 2,
        sharedCount: 2,
      }),
    ).toMatchObject({
      ok: true,
      output: { similarity: { exactJaccard: 1, estimatedJaccard: 1 } },
    });
    expect(
      tool.execute({
        ...example.input,
        leftCount: 0,
        rightCount: 0,
        sharedCount: 0,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        similarity: { exactJaccard: 1, estimatedJaccard: 1 },
        signatures: {
          left: [4294967295, 4294967295, 4294967295, 4294967295],
          right: [4294967295, 4294967295, 4294967295, 4294967295],
        },
      },
    });
    expect(
      tool.execute({
        ...example.input,
        leftCount: 0,
        rightCount: 2,
        sharedCount: 0,
      }),
    ).toMatchObject({ ok: true, output: { similarity: { exactJaccard: 0 } } });
  });
  it("rejects impossible overlaps, insufficient distinct universes, invalid hash counts, and excess work", () => {
    for (const change of [
      { sharedCount: 3 },
      { leftCount: 4, rightCount: 4, sharedCount: 0 },
      { universe: ["x", "x"] },
      { hashCount: 0 },
      { hashCount: 257 },
      { leftCount: -1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
    expect(
      tool.execute({
        ...example.input,
        universe: Array.from({ length: 256 }, (_, i) =>
          String(i).padEnd(64, "x"),
        ),
        leftCount: 128,
        rightCount: 128,
        sharedCount: 0,
        hashCount: 256,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
  });
});
