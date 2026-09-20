import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  correlatedPointDatasetExample as example,
  calculateCorrelatedPointDataset,
} from "./tool.js";

describe("Random Correlated Point Dataset Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateCorrelatedPointDataset(example.input)).toEqual({
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
  it("has exact affine dependence at both population-correlation endpoints", () => {
    for (const targetCorrelation of [-1, 1]) {
      const result = tool.execute({
        ...example.input,
        count: 30,
        targetCorrelation,
      });
      if (!result.ok) throw new Error("Expected success");
      result.output.x.forEach((x, i) =>
        expect(result.output.y[i] + 5).toBeCloseTo(
          (targetCorrelation * (x - 10)) / 2,
          12,
        ),
      );
      expect(result.output.diagnostics.sampleCorrelation).toBe(
        targetCorrelation,
      );
    }
  });
  it("has a known two-normal transform and explicitly reports constant realized coordinates", () => {
    const draws = [Math.exp(-0.5), 0, Math.exp(-0.5), 0.5];
    let i = 0;
    const { seed, ...input } = example.input;
    const result = calculateCorrelatedPointDataset(
      { ...input, count: 2, targetCorrelation: 0.6 },
      { random: () => draws[i++ % 4] },
    );
    if (!result.ok) throw new Error("Expected success");
    // Radius1 and angles0/pi give independent normals+1/-1, hence X=12,
    // Y=-5+0.6-0.8=-5.2. Repeating that pair makes both realized axes constant.
    expect(result.output.x).toEqual([12, 12]);
    for (const y of result.output.y) expect(y).toBeCloseTo(-5.2, 14);
    expect(result.output.diagnostics.sampleCorrelation).toBe(null);
    expect(result.output.randomness).toEqual({ seed: null, source: "context" });
    expect(i).toBe(8);
    const constant = tool.execute({ ...example.input, standardDeviationX: 0 });
    if (!constant.ok) throw new Error("Expected success");
    expect(constant.output.diagnostics.sampleCorrelation).toBe(null);
    expect(
      tool.execute({ ...example.input, targetCorrelation: 1.1 }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "targetCorrelation" }] },
    });
    expect(
      tool.execute(
        {
          count: 2,
          meanX: 1e308,
          meanY: 0,
          standardDeviationX: 1e308,
          standardDeviationY: 1,
          targetCorrelation: 0,
        },
        { random: () => 0.00001 },
      ),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "standardDeviationX", code: "numeric_overflow" }],
      },
    });
  });
  it("distinguishes population correlation from the realized two-point correlation", () => {
    const draws = [
      Math.exp(-0.5),
      0,
      Math.exp(-0.5),
      0.5,
      Math.exp(-0.5),
      0.5,
      Math.exp(-0.5),
      0,
    ];
    let index = 0;
    const result = calculateCorrelatedPointDataset(
      {
        count: 2,
        meanX: 0,
        meanY: 0,
        standardDeviationX: 1,
        standardDeviationY: 1,
        targetCorrelation: 0.6,
      },
      { random: () => draws[index++] },
    );
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.x).toEqual([1, -1]);
    expect(result.output.y[0]).toBeCloseTo(-0.2, 15);
    expect(result.output.y[1]).toBeCloseTo(0.2, 15);
    expect(result.output.targetCorrelation).toBe(0.6);
    expect(result.output.diagnostics.sampleCorrelation).toBe(-1);
  });
});
