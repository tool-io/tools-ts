import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateMonteCarloRandomWalk,
  monteCarloRandomWalkExample as example,
} from "./tool.js";
describe("one-dimensional Monte Carlo random walk", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("matches two hand-replayed paths and their population variance", () => {
    const draws = [0.25, 0.75, 0.25, 0.75, 0.75, 0.25];
    let calls = 0;
    expect(
      calculateMonteCarloRandomWalk(
        {
          steps: 3,
          pathCount: 2,
          startPosition: 10,
          positiveStepProbability: 0.5,
        },
        { random: () => draws[calls++] },
      ),
    ).toEqual({
      ok: true,
      output: {
        paths: [
          [10, 11, 10, 11],
          [10, 9, 8, 9],
        ],
        finalPositions: [11, 9],
        endpointMean: 10,
        endpointPopulationVariance: 1,
        randomness: { seed: null, source: "context" },
      },
    });
    expect(calls).toBe(6);
  });
  it("retains exact sizes and unit-step/parity invariants", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.paths).toHaveLength(3);
    result.output.paths.forEach((path, index) => {
      expect(path).toHaveLength(7);
      expect(path[0]).toBe(2);
      for (let i = 1; i < path.length; i += 1)
        expect(Math.abs(path[i] - path[i - 1])).toBe(1);
      expect(path.at(-1)).toBe(result.output.finalPositions[index]);
      expect(Math.abs((result.output.finalPositions[index] - 2) % 2)).toBe(0);
    });
  });
  it("handles deterministic probability endpoints and a single path", () => {
    const forward = tool.execute({
      steps: 3,
      pathCount: 1,
      startPosition: 10,
      positiveStepProbability: 1,
      seed: 5,
    });
    if (!forward.ok) throw new Error("Expected success");
    expect(forward.output.paths).toEqual([[10, 11, 12, 13]]);
    expect(forward.output.endpointPopulationVariance).toBe(0);
    const backward = tool.execute({
      steps: 3,
      pathCount: 1,
      startPosition: 10,
      positiveStepProbability: 0,
      seed: 5,
    });
    if (!backward.ok) throw new Error("Expected success");
    expect(backward.output.paths).toEqual([[10, 9, 8, 7]]);
    expect(
      tool.execute({
        steps: 1,
        pathCount: 1,
        startPosition: Number.MAX_SAFE_INTEGER,
        positiveStepProbability: 1,
        seed: 5,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "unsafe_walk_position", field: "startPosition" }],
      },
    });
    expect(
      tool.execute({
        steps: 1,
        pathCount: 1,
        startPosition: Number.MAX_SAFE_INTEGER,
        positiveStepProbability: 0,
        seed: 5,
      }).ok,
    ).toBe(true);
  });
  it("is immutable and reproducible, validates resource products, and respects seed precedence", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("Seed must win");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    expect(
      tool.execute({ ...example.input, steps: 1024, pathCount: 32 }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ code: "resource_limit_exceeded", field: "pathCount" }],
      },
    });
    expect(tool.execute({ ...example.input, steps: 0 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_field", field: "steps" }] },
    });
    for (const positiveStepProbability of [-0.1, 1.1, NaN, Infinity])
      expect(
        tool.execute({ ...example.input, positiveStepProbability }),
      ).toMatchObject({
        ok: false,
        error: {
          issues: [{ code: "invalid_field", field: "positiveStepProbability" }],
        },
      });
  });
  it("rejects bad sources and malformed input with stable fields", () => {
    const { seed, ...input } = example.input;
    for (const value of [-0.1, 1, NaN, Infinity])
      expect(tool.execute(input, { random: () => value })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_random_source", field: "random" }] },
      });
    expect(
      tool.execute(input, {
        random: () => {
          throw new Error("Failure");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "invalid_random_source", field: "random" }] },
    });
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ code: "object_required", field: "" }] },
    });
    expect(tool.execute({})).toMatchObject({
      ok: false,
      error: {
        issues: tool.inputSchema.required?.map((field) => ({
          code: "required_field",
          field,
        })),
      },
    });
    expect(tool.execute({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "unknown_field", field: "extra" }] },
    });
  });
});
