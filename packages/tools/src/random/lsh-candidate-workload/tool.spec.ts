import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  lshCandidateWorkloadExample as example,
  calculateLshCandidateWorkload,
} from "./tool.js";

describe("Random LSH Candidate Workload Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateLshCandidateWorkload(example.input)).toEqual({
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
  it("matches an independent contiguous-band scan and exact intersection counting", () => {
    for (const bandCount of [1, 2, 4, 8]) {
      const result = tool.execute({
        ...example.input,
        pairCount: 10,
        hashCount: 8,
        bandCount,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      const rows = 8 / bandCount;
      for (const pair of result.output.pairs) {
        const expected: number[] = [];
        for (let band = 0; band < bandCount; band += 1)
          if (
            Array.from({ length: rows }, (_, i) => band * rows + i).every(
              (index) =>
                pair.leftSignature[index] === pair.rightSignature[index],
            )
          )
            expected.push(band);
        expect(pair.matchingBands).toEqual(expected);
        expect(pair.candidate).toBe(expected.length > 0);
        expect(pair.shared).toEqual(
          pair.left.filter((value) => pair.right.includes(value)),
        );
        expect(pair.exactJaccard).toBe(
          pair.shared.length / new Set([...pair.left, ...pair.right]).size,
        );
      }
      expect(result.output.candidateCount).toBe(
        result.output.pairs.filter((pair) => pair.candidate).length,
      );
    }
  });
  it("retains identical/empty-set conventions without inventing retrieval guarantees", () => {
    const result = tool.execute({ ...example.input, sharedCount: 2 });
    expect(result.ok).toBe(true);
    if (result.ok)
      for (const pair of result.output.pairs)
        expect(pair).toMatchObject({
          exactJaccard: 1,
          estimatedJaccard: 1,
          candidate: true,
          matchingBands: [0, 1, 2, 3],
        });
    const empty = tool.execute({
      ...example.input,
      leftCount: 0,
      rightCount: 0,
      sharedCount: 0,
    });
    expect(empty).toMatchObject({ ok: true, output: { candidateCount: 2 } });
    if (empty.ok)
      expect(
        empty.output.pairs.every(
          (pair) => pair.exactJaccard === 1 && pair.candidate,
        ),
      ).toBe(true);
  });
  it("rejects incompatible bands, impossible overlaps, and excessive work", () => {
    for (const change of [
      { bandCount: 3 },
      { bandCount: 8 },
      { sharedCount: 3 },
      { pairCount: 33 },
      { hashCount: 0 },
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
        pairCount: 32,
        leftCount: 128,
        rightCount: 128,
        sharedCount: 0,
        hashCount: 256,
        bandCount: 16,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "resource_limit" }] },
    });
  });
});
