import { describe, it, expect } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  example,
  calculateFunnelStageCountDataset as calculate,
  runFunnelStageCountDataset as run,
} from "./index.js";
describe("random/funnel-stage-count-dataset", () => {
  it("lightweight negative-zero opening returns exact zero counts and null ratios", () => {
    const input = {
      stages: ["a", "b"],
      opening: -0,
      maximumDrops: [-0],
      seed: 42,
    };
    expect(run(input)).toEqual({
      ok: true,
      output: {
        counts: [0, 0],
        drops: [0],
        conversions: [null],
        stages: ["a", "b"],
        randomness: { seed: 42, source: "seed" },
      },
    });
    expect(Object.is(input.opening, -0)).toBe(true);
    expect(Object.is(input.maximumDrops[0], -0)).toBe(true);
  });
  it("lightweight canonical calculation, index runner, contract and JSON schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculate(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(run(example.input)).toEqual({ ok: true, output: example.output });
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("lightweight replay, source validation, seed precedence and immutability", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(run(input)).toEqual(run(example.input));
    expect(input).toEqual(example.input);
    expect(
      run(input, {
        random: () => {
          throw new Error("seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...unseeded } = input;
    expect(run(unseeded)).toEqual(run(unseeded));
    for (const bad of [NaN, 1, -0.1])
      expect(run(unseeded, { random: () => bad })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
    expect(
      run(unseeded, {
        random: () => {
          throw new Error("source failed");
        },
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "random", code: "invalid_random_source" }] },
    });
    let calls = 0;
    const generated = run(unseeded, {
      random: () => {
        calls++;
        return 0.25;
      },
    });
    expect(generated.ok).toBe(true);
    expect(calls).toBeGreaterThan(0);
    if (generated.ok) {
      expect(generated.output.randomness).toEqual({
        seed: null,
        source: "context",
      });
      expect(matchesToolJsonSchema(generated.output, tool.outputSchema)).toBe(
        true,
      );
      expect(JSON.parse(JSON.stringify(generated.output))).toEqual(
        generated.output,
      );
    }
  });
  it("lightweight full missing-field and stable boundary diagnostics", () => {
    const missing = run({});
    if (missing.ok) throw new Error("Expected missing input errors");
    expect(
      missing.error.issues.map((issue) => ({
        field: issue.field,
        code: issue.code,
      })),
    ).toEqual([
      { field: "stages", code: "required_field" },
      { field: "opening", code: "required_field" },
      { field: "maximumDrops", code: "required_field" },
    ]);
    expect(run({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(run({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(run({ ...example.input, maximumDrops: [4] })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "maximumDrops", code: "shape_mismatch" }] },
    });
  });
  it("lightweight independent model case and invariant", () => {
    const r = run({
      stages: ["a", "b", "c"],
      opening: 0,
      maximumDrops: [2, 3],
    });
    if (!r.ok) throw new Error("Expected empty funnel");
    expect(r.output.counts).toEqual([0, 0, 0]);
    expect(r.output.conversions).toEqual([null, null]);
  });
});
