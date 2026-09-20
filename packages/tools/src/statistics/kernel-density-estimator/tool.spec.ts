import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  calculateKernelDensityEstimator,
  kernelDensityEstimatorExample as example,
} from "./tool.js";

describe("Gaussian KDE", () => {
  it("matches its canonical example and contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(tool.execute(example.input)).toEqual({
      ok: true,
      output: example.output,
    });
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
    expect(JSON.parse(JSON.stringify(example))).toEqual(example);
  });
  it("agrees with published standard-normal ordinates for a single kernel", () => {
    const result = calculateKernelDensityEstimator({
      sample: [0],
      points: [0, 1, 2],
      bandwidth: 1,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.densities[0]).toBeCloseTo(0.3989422804014327, 15);
    expect(result.output.densities[1]).toBeCloseTo(0.24197072451914337, 15);
    expect(result.output.densities[2]).toBeCloseTo(0.05399096651318806, 15);
  });
  it("preserves input and scales as a probability density, not a probability mass", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    const result = tool.execute({
      sample: [0, 4],
      points: [0, 2, 4],
      bandwidth: 2,
    });
    if (!result.ok) throw new Error("Expected success");
    result.output.densities.forEach((density, i) =>
      expect(density).toBeCloseTo(example.output.densities[i] / 2, 15),
    );
  });
  it("handles repeated samples, distant tails, and subtraction overflow", () => {
    const result = tool.execute({
      sample: [4, 4],
      points: [4, 1e200],
      bandwidth: 1,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.densities).toEqual([0.3989422804014327, 0]);
    const extreme = tool.execute({
      sample: [-Number.MAX_VALUE],
      points: [Number.MAX_VALUE],
      bandwidth: Number.MAX_VALUE,
    });
    if (!extreme.ok) throw new Error("Expected success");
    expect(extreme.output.densities[0]).toBeGreaterThan(0);
    expect(
      tool.execute({ sample: [0], points: [0], bandwidth: Number.MIN_VALUE }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "numeric_overflow", field: "bandwidth" }] },
    });
  });
  it("rejects invalid bandwidths, lists, dimensions and extra fields specifically", () => {
    for (const bandwidth of [0, -1, NaN, Infinity])
      expect(tool.execute({ ...example.input, bandwidth })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "bandwidth" }] },
      });
    for (const sample of [[], [NaN], [Infinity], Array(513).fill(0)])
      expect(tool.execute({ ...example.input, sample })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "sample" }] },
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
