import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  differentiatedActivityAssignmentExample as example,
  calculateDifferentiatedActivityAssignment,
} from "./tool.js";

describe("Random Differentiated Activity Assignment Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateDifferentiatedActivityAssignment(example.input)).toEqual({
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
  it("uses inclusive lower cutoffs and never mixes banks or randomizes scores", () => {
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.output.assignments.map((a) => a.tier)).toEqual([
      "foundation",
      "intermediate",
      "advanced",
    ]);
    result.output.assignments.forEach((assignment, i) => {
      expect(assignment.readinessScore).toBe(
        example.input.students[i].readinessScore,
      );
      expect(example.input.activities[assignment.tier]).toContain(
        assignment.activityId,
      );
    });
  });
  it("permits empty unoccupied tiers and equal cutoffs", () => {
    expect(
      tool.execute({
        students: [{ id: "A", readinessScore: 40 }],
        intermediateCutoff: 40,
        advancedCutoff: 40,
        activities: { foundation: [], intermediate: [], advanced: ["task"] },
        seed: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: {
        assignments: [{ tier: "advanced", activityId: "task" }],
        tiers: { foundationIds: [], intermediateIds: [], advancedIds: ["A"] },
      },
    });
  });
  it("rejects missing occupied banks, duplicate learners, reversed cutoffs and nonfinite scores", () => {
    for (const change of [
      { activities: { ...example.input.activities, intermediate: [] } },
      {
        students: [
          { id: "A", readinessScore: 0 },
          { id: "A", readinessScore: 1 },
        ],
      },
      { intermediateCutoff: 81 },
      { students: [{ id: "A", readinessScore: Infinity }] },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
