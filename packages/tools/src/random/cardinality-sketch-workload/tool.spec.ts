import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  cardinalitySketchWorkloadExample as example,
  calculateCardinalitySketchWorkload,
} from "./tool.js";

describe("Random Cardinality Sketch Workload Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCardinalitySketchWorkload(example.input)).toEqual({
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
  it("constructs exact configured duplicate density rather than a probabilistic unique-count promise", () => {
    for (let seed = 0; seed < 16; seed += 1) {
      const result = tool.execute({
        ...example.input,
        streamLength: 50,
        distinctCount: 4,
        seed,
      });
      expect(result.ok).toBe(true);
      if (!result.ok) continue;
      expect(result.output.stream).toHaveLength(50);
      expect(new Set(result.output.stream).size).toBe(4);
      expect(result.output.exact).toEqual({
        uniqueCount: 4,
        duplicateCount: 46,
        duplicateFraction: 46 / 50,
      });
      expect(result.output.sketch.signedError).toBe(
        result.output.sketch.estimate - 4,
      );
      expect(result.output.sketch.relativeError).toBe(
        (result.output.sketch.estimate - 4) / 4,
      );
    }
  });
  it("is invariant to repeated occurrences of the same complete selected universe", () => {
    const first = tool.execute({
        ...example.input,
        distinctCount: 4,
        streamLength: 4,
      }),
      second = tool.execute({
        ...example.input,
        distinctCount: 4,
        streamLength: 200,
        seed: 7,
      });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok)
      expect(first.output.sketch.estimate).toBe(second.output.sketch.estimate);
    expect(
      tool.execute({ ...example.input, streamLength: 0, distinctCount: 0 }),
    ).toMatchObject({
      ok: true,
      output: {
        stream: [],
        exact: { uniqueCount: 0, duplicateCount: 0, duplicateFraction: null },
        sketch: { estimate: 0, signedError: 0, relativeError: null },
      },
    });
  });
  it("rejects infeasible cardinalities, unsupported precision, and resource excess", () => {
    for (const change of [
      { distinctCount: 5 },
      { distinctCount: 0 },
      { streamLength: 2 },
      { streamLength: 2049 },
      { precision: 3 },
      { precision: 17 },
      { streamLength: 0, distinctCount: 1 },
    ])
      expect(tool.execute({ ...example.input, ...change })).toMatchObject({
        ok: false,
      });
  });
});
