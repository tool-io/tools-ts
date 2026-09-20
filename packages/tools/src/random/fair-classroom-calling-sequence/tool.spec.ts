import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  fairClassroomCallingSequenceExample as example,
  calculateFairClassroomCallingSequence,
} from "./tool.js";

describe("Random Fair Classroom Calling Sequence Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFairClassroomCallingSequence(example.input)).toEqual({
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
  it("never selects above the current minimum and preserves aligned counts", () => {
    const result = tool.execute({ ...example.input, turns: 100 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    const counts = [...example.input.priorCallCounts];
    for (const step of result.output.trace) {
      const minimum = Math.min(...counts),
        eligible = example.input.studentIds.filter(
          (_, i) => counts[i] === minimum,
        );
      expect(step.eligibleIds).toEqual(eligible);
      expect(eligible).toContain(step.chosenId);
      const index = example.input.studentIds.indexOf(step.chosenId);
      expect(step.countBefore).toBe(counts[index]);
      counts[index]++;
      expect(step.countAfter).toBe(counts[index]);
      expect(step.spreadAfter).toBe(Math.max(...counts) - Math.min(...counts));
    }
    expect(result.output.finalCallCounts).toEqual(counts);
  });
  it("ties reach both endpoints of the caller's order without changing non-tie eligibility", () => {
    for (const [draw, chosenId] of [
      [0, "A"],
      [1 - Number.EPSILON, "C"],
    ] as const)
      expect(
        tool.execute(
          { studentIds: ["A", "B", "C"], priorCallCounts: [0, 0, 0], turns: 1 },
          { random: () => draw },
        ),
      ).toMatchObject({ ok: true, output: { trace: [{ chosenId }] } });
    expect(
      tool.execute({
        studentIds: ["max", "min"],
        priorCallCounts: [Number.MAX_SAFE_INTEGER, 0],
        turns: 1,
        seed: 1,
      }),
    ).toMatchObject({
      ok: true,
      output: { finalCallCounts: [Number.MAX_SAFE_INTEGER, 1] },
    });
  });
  it("rejects misalignment and only actual selected-count overflow", () => {
    expect(
      tool.execute({
        studentIds: ["A"],
        priorCallCounts: [Number.MAX_SAFE_INTEGER],
        turns: 1,
        seed: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "count_overflow" }] },
    });
    for (const change of [
      { priorCallCounts: [0] },
      { studentIds: ["A", "A", "B"] },
      { priorCallCounts: [0, -1, 2] },
      { turns: 513 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
