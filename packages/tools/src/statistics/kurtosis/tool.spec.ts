import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, { calculateKurtosis, kurtosisExample as example } from "./tool.js";

describe("sample kurtosis", () => {
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
  it("agrees with a two-point symmetric distribution and allows negative corrected estimates", () => {
    expect(calculateKurtosis({ values: [-7, 7] })).toEqual({
      ok: true,
      output: {
        biasCorrected: false,
        count: 2,
        excessKurtosis: -2,
        pearsonKurtosis: 1,
      },
    });
    expect(
      tool.execute({ values: [-1, -1, 1, 1], biasCorrected: true }),
    ).toEqual({
      ok: true,
      output: {
        biasCorrected: true,
        count: 4,
        excessKurtosis: -6,
        pearsonKurtosis: -3,
      },
    });
  });
  it("is scale invariant even when unscaled fourth powers would overflow", () => {
    const result = tool.execute({ values: [-2e200, -1e200, 0, 1e200, 2e200] });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.pearsonKurtosis).toBeCloseTo(1.7, 14);
    expect(result.output.excessKurtosis).toBeCloseTo(-1.3, 14);
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
  });
  it("distinguishes insufficient corrected samples and zero variance", () => {
    expect(
      tool.execute({ values: [1, 2, 4], biasCorrected: true }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ code: "insufficient_samples", field: "values" }] },
    });
    expect(tool.execute({ values: [4, 4] })).toMatchObject({
      ok: false,
      error: { issues: [{ code: "zero_variance", field: "values" }] },
    });
    for (const values of [[], [1], [1, NaN], [1, Infinity], Array(513).fill(1)])
      expect(tool.execute({ values })).toMatchObject({
        ok: false,
        error: { issues: [{ code: "invalid_field", field: "values" }] },
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
