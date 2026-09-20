import { describe, it, expect } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  example,
  calculateRadarAxisComparisonDataset as calculate,
  runRadarAxisComparisonDataset as run,
} from "./index.js";
describe("random/radar-axis-comparison-dataset", () => {
  it("lightweight copied negative-zero axis bounds normalize exactly", () => {
    const axes = [
      { id: "a", minimum: -0, maximum: 1 },
      { id: "b", minimum: -0, maximum: 2 },
      { id: "c", minimum: -0, maximum: 3 },
    ];
    const r = run({ axes, profiles: ["p"], missingProbability: 1, seed: 42 });
    if (!r.ok) throw new Error("Expected missing profile");
    expect(r.output.axes.map((a) => a.minimum)).toEqual([0, 0, 0]);
    expect(r.output.values).toEqual([[null, null, null]]);
    expect(Object.is(axes[0].minimum, -0)).toBe(true);
    expect(JSON.parse(JSON.stringify(r.output))).toEqual(r.output);
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
      { field: "axes", code: "required_field" },
      { field: "profiles", code: "required_field" },
      { field: "missingProbability", code: "required_field" },
    ]);
    expect(run({ ...example.input, extra: 1 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(run({ ...example.input, seed: NaN })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(run({ ...example.input, missingProbability: 2 })).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "missingProbability", code: "invalid_field" }],
      },
    });
  });
  it("lightweight independent model case and invariant", () => {
    const r = run({ ...example.input, missingProbability: 1 });
    if (!r.ok) throw new Error("Expected missing profile");
    expect(r.output.values).toEqual([[null, null, null]]);
    expect(r.output.axes.map((a) => a.observedMaximum)).toEqual([
      null,
      null,
      null,
    ]);
  });
});
