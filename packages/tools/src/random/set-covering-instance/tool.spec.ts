import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  setCoveringInstanceExample as example,
  calculateSetCoveringInstance,
} from "./tool.js";
const smallInput = {
  universeSize: 3,
  setCount: 1,
  plantedSetCount: 1,
  extraInclusionProbability: 0,
  minimumCost: 2,
  maximumCost: 2,
  seed: 42,
} as const;

describe("Random Set Covering Instance Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateSetCoveringInstance(example.input)).toEqual({
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
  it("checks the cover witness and validates every subset", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...smallInput,
        universeSize: 12,
        setCount: 20,
        plantedSetCount: 4,
        extraInclusionProbability: 0.4,
        maximumCost: 9,
        seed,
      });
      if (!result.ok) throw new Error("Expected success");
      const out = result.output,
        multiplicities = Array<number>(12).fill(0);
      expect(out.subsets).toHaveLength(20);
      expect(out.costs).toHaveLength(20);
      for (const subset of out.subsets) {
        expect(subset.length).toBeGreaterThan(0);
        expect(new Set(subset).size).toBe(subset.length);
        for (const v of subset) expect(out.universe).toContain(v);
      }
      for (const index of out.witnessIndices)
        for (const element of out.subsets[index]) multiplicities[element] += 1;
      for (const count of multiplicities)
        expect(count).toBeGreaterThanOrEqual(1);
      expect(out.witnessCost).toBe(
        out.witnessIndices.reduce((sum, index) => sum + out.costs[index], 0),
      );
    }
  });
  it("keeps nonempty extra columns and rejects infeasible partitions and unsafe totals", () => {
    const result = tool.execute({ ...smallInput, setCount: 5 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.subsets.every((s) => s.length > 0)).toBe(true);
    expect(tool.execute({ ...smallInput, plantedSetCount: 2 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "plantedSetCount" }] },
    });
    expect(
      tool.execute({
        ...smallInput,
        universeSize: 2,
        setCount: 2,
        plantedSetCount: 2,
        minimumCost: Number.MAX_SAFE_INTEGER,
        maximumCost: Number.MAX_SAFE_INTEGER,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unsafe_aggregate" }] },
    });
  });
});
