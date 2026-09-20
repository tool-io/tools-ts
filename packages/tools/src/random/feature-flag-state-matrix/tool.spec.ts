import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  example,
  calculateFeatureFlagStateMatrix,
  runFeatureFlagStateMatrix,
} from "./index.js";
describe("feature-flag-state-matrix", () => {
  it("lightweight inherited property names have zero unselected frequency", () => {
    const result = tool.execute(
      {
        flags: ["toString", "__proto__"],
        dependencies: [],
        exclusions: [],
        count: 1,
      },
      { random: () => 0 },
    );
    if (!result.ok) throw new Error("Expected all-disabled state");
    expect(result.output.states).toEqual([
      { enabled: [], bits: [false, false] },
    ]);
    expect(result.output.enabledCounts).toEqual([
      { flag: "toString", count: 0 },
      { flag: "__proto__", count: 0 },
    ]);
    expect(matchesToolJsonSchema(result.output, tool.outputSchema)).toBe(true);
  });
  it("lightweight canonical calculation, index runner and schema contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateFeatureFlagStateMatrix(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(runFeatureFlagStateMatrix(example.input)).toEqual({
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
  it("lightweight replay, seed precedence, advancing checked sources and immutability", () => {
    const saved = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    expect(tool.execute(saved)).toEqual(tool.execute(example.input));
    expect(saved).toEqual(example.input);
    expect(
      tool.execute(example.input, {
        random: () => {
          throw new Error("seed wins");
        },
      }),
    ).toEqual({ ok: true, output: example.output });
    const { seed, ...input } = example.input;
    expect(tool.execute(input)).toEqual(tool.execute(input));
    let draws = 0;
    const contextual = tool.execute(input, {
      random: () => {
        draws += 1;
        return 0.25;
      },
    });
    expect(contextual.ok).toBe(true);
    expect(draws).toBeGreaterThan(0);
    if (contextual.ok) {
      expect(contextual.output.randomness).toEqual({
        source: "context",
        seed: null,
      });
      expect(matchesToolJsonSchema(contextual.output, tool.outputSchema)).toBe(
        true,
      );
    }
    for (const random of [
      () => NaN,
      () => 1,
      () => -0.1,
      () => {
        throw new Error("source failed");
      },
    ])
      expect(tool.execute(input, { random })).toMatchObject({
        ok: false,
        error: { issues: [{ field: "random", code: "invalid_random_source" }] },
      });
  });
  it("lightweight complete missing-field diagnostics and stable boundaries", () => {
    const missing = tool.execute({});
    if (missing.ok) throw new Error("Expected required fields");
    expect(missing.error.issues.map((i) => [i.field, i.code])).toEqual(
      (tool.inputSchema.required ?? []).map((field) => [
        field,
        "required_field",
      ]),
    );
    expect(missing.error.issues).toHaveLength(
      tool.inputSchema.required?.length ?? 0,
    );
    expect(tool.execute(null)).toMatchObject({
      ok: false,
      error: { issues: [{ field: "", code: "object_required" }] },
    });
    expect(tool.execute({ ...example.input, extra: true })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "extra", code: "unknown_field" }] },
    });
    expect(tool.execute({ ...example.input, seed: Infinity })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "seed", code: "invalid_field" }] },
    });
    expect(tool.execute({ ...example.input, count: 4 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "count", code: "infeasible_count" }] },
    });
  });
  it("lightweight independent model case and invariant", () => {
    const r = tool.execute({ ...example.input, count: 3 });
    if (!r.ok) throw new Error("success");
    expect(r.output.feasibleCount).toBe(3);
    expect(r.output.enabledCounts).toEqual([
      { flag: "A", count: 1 },
      { flag: "B", count: 2 },
    ]);
    for (const s of r.output.states)
      if (s.enabled.includes("A")) expect(s.enabled).toContain("B");
  });
});
