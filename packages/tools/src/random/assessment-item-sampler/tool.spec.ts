import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  assessmentItemSamplerExample as example,
  calculateAssessmentItemSampler,
} from "./tool.js";

describe("Random Assessment Item Sampler Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateAssessmentItemSampler(example.input)).toEqual({
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
  it("meets exact objective counts without replacing or altering supplied items", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(new Set(result.output.items.map((item) => item.id)).size).toBe(3);
    for (const item of result.output.items)
      expect(item).toEqual(
        example.input.bank.find((candidate) => candidate.id === item.id),
      );
    for (const objective of example.input.objectives)
      expect(
        result.output.items.filter((item) => item.objectiveId === objective.id),
      ).toHaveLength(objective.count);
    expect(result.output.coverage.uncoveredObjectiveIds).toEqual(["O3"]);
  });
  it("exposes caller-selected minimum coverage and ignores unrequested bank objectives", () => {
    const result = tool.execute({
      ...example.input,
      objectives: [{ id: "O1", count: 1 }],
      minimumItemsPerObjective: 2,
    });
    expect(result).toMatchObject({
      ok: true,
      output: {
        coverage: {
          objectiveIds: ["O1"],
          itemCounts: [1],
          uncoveredObjectiveIds: ["O1"],
          coveragePercent: 0,
        },
      },
    });
    if (result.ok)
      expect(
        result.output.items.every((item) => item.objectiveId === "O1"),
      ).toBe(true);
  });
  it("rejects shortages, ambiguous IDs and empty requested papers before sampling", () => {
    for (const change of [
      { objectives: [{ id: "O1", count: 4 }] },
      { objectives: [{ id: "O1", count: 0 }] },
      {
        objectives: [
          { id: "O1", count: 1 },
          { id: "O1", count: 1 },
        ],
      },
      { bank: [example.input.bank[0], example.input.bank[0]] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
