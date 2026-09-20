import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  fadedSolutionPracticePacketExample as example,
  calculateFadedSolutionPracticePacket,
} from "./tool.js";

describe("Random Faded Solution Practice Packet Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFadedSolutionPracticePacket(example.input)).toEqual({
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
  it("partitions each exact caller-authored solution at the delegated fade count", () => {
    const result = tool.execute({ ...example.input, count: 8 });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    result.output.exercises.forEach((exercise, i) => {
      const problem = example.input.problems.find(
        (p) => p.id === exercise.problemId,
      );
      if (!problem)
        throw new Error("Each exercise must retain a supplied problem ID.");
      expect(exercise.solutionSteps).toEqual(problem.solutionSteps);
      expect(exercise.providedStepCount).toBe(
        Math.max(0, problem.solutionSteps.length - i),
      );
      expect([...exercise.visibleSteps, ...exercise.hiddenSteps]).toEqual(
        problem.solutionSteps,
      );
      expect(exercise.visibleSteps).toHaveLength(exercise.providedStepCount);
    });
    expect(result.output.independentProblemCount).toBe(6);
  });
  it("uses each selected problem's actual step count rather than an invented uniform solution", () => {
    const result = tool.execute(
      {
        problems: [
          { id: "one", prompt: "P", solutionSteps: ["A"] },
          { id: "three", prompt: "Q", solutionSteps: ["X", "Y", "Z"] },
        ],
        count: 3,
      },
      { random: () => 0.99 },
    );
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.exercises.map((e) => e.providedStepCount)).toEqual([
        3, 2, 1,
      ]);
  });
  it("rejects duplicate IDs, empty solutions and resource overflow", () => {
    for (const change of [
      { problems: [example.input.problems[0], example.input.problems[0]] },
      { problems: [{ id: "x", prompt: "P", solutionSteps: [] }] },
      { count: 33 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
