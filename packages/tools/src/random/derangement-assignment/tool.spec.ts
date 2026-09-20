import { describe, expect, it } from "vitest";
import { calculatePermutations } from "../../list/permutations/tool.js";
import tool, {
  calculateDerangementAssignment,
  derangementAssignmentExample as example,
} from "./tool.js";
import { snAuthoringSpecs } from "../m250-sampling-narrative-spec-support.js";

describe(tool.id, () => {
  snAuthoringSpecs(tool, calculateDerangementAssignment, example);
  it("covers all nine four-item derangements by distinct exact ranks, including two cycles", () => {
    const independent = calculatePermutations({
      values: [0, 1, 2, 3],
    }).permutations.filter((permutation) =>
      permutation.every((value, position) => value !== position),
    );
    expect(independent).toHaveLength(9);
    const actual: string[] = [];
    for (let rank = 0; rank < 9; rank += 1) {
      // A word containing this rank directly; no rejection or scaling by9.
      const result = calculateDerangementAssignment(
        { ids: example.input.ids },
        { random: () => rank / 4294967296 },
      );
      if (!result.ok) throw new Error("Expected success");
      expect(result.output.sampledRank).toBe(String(rank));
      actual.push(
        result.output.assignments
          .map((pair) => example.input.ids.findIndex((id) => id === pair.to))
          .join(","),
      );
    }
    expect(new Set(actual)).toEqual(
      new Set(independent.map((permutation) => permutation.join(","))),
    );
    expect(example.output.cycles).toEqual([
      ["A", "B"],
      ["C", "D"],
    ]);
  });
  it("retains independently known counts and reconstructable cycle decompositions", () => {
    const ids = Array.from({ length: 10 }, (_, i) => `person-${i}`);
    const result = tool.execute({ ids, seed: 7 });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.exactCount).toBe("1334961");
    expect(new Set(result.output.assignments.map((pair) => pair.to))).toEqual(
      new Set(ids),
    );
    expect(
      result.output.assignments.every((pair) => pair.from !== pair.to),
    ).toBe(true);
    expect(result.output.cycles.flat().sort()).toEqual([...ids].sort());
    for (const cycle of result.output.cycles)
      for (let i = 0; i < cycle.length; i += 1)
        expect(
          result.output.assignments.find((pair) => pair.from === cycle[i])?.to,
        ).toBe(cycle[(i + 1) % cycle.length]);
    expect(tool.execute({ ids: ["left", "right"] })).toMatchObject({
      ok: true,
      output: {
        exactCount: "1",
        sampledRank: "0",
        assignments: [
          { from: "left", to: "right" },
          { from: "right", to: "left" },
        ],
      },
    });
  });
  it("bounds degenerate-source rejection without biasing the accepted rank range", () => {
    expect(
      calculateDerangementAssignment(
        { ids: example.input.ids },
        { random: () => 15 / 4294967296 },
      ),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "random_rejection_limit" }] },
    });
    let calls = 0;
    const result = calculateDerangementAssignment(
      { ids: example.input.ids },
      { random: () => (calls++ === 0 ? 15 : 8) / 4294967296 },
    );
    expect(result).toMatchObject({ ok: true, output: { sampledRank: "8" } });
    expect(calls).toBe(2);
  });
  it("rejects singletons, duplicate identity, and exponential-size requests", () => {
    expect(tool.execute({ ids: ["a"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "ids", code: "invalid_field" }] },
    });
    expect(tool.execute({ ids: ["a", "a"] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "ids", code: "duplicate_id" }] },
    });
    expect(
      tool.execute({ ids: Array.from({ length: 17 }, (_, i) => String(i)) }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "ids", code: "invalid_field" }] },
    });
  });
});
