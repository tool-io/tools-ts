import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  medianAbsoluteDeviationExample as example,
  calculateMedianAbsoluteDeviation,
} from "./tool.js";
describe("Median Absolute Deviation Calculator", () => {
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
  it("uses the specified aggregation instead of conflating mean and median", () => {
    expect(
      calculateMedianAbsoluteDeviation({ values: [2, 3, 3, 5, 1000] }),
    ).toEqual({ ok: true, output: { count: 5, deviation: 1, median: 3 } });
    expect(tool.execute({ values: [8, 8, 8] })).toEqual({
      ok: true,
      output: { count: 3, deviation: 0, median: 8 },
    });
    expect(tool.execute({ values: [-4, 8] })).toEqual({
      ok: true,
      output: { count: 2, deviation: 6, median: 2 },
    });
    expect(tool.execute({ values: [9] })).toEqual({
      ok: true,
      output: { count: 1, deviation: 0, median: 9 },
    });
  });
  it("handles an even median whose naive midpoint overflows", () => {
    expect(
      tool.execute({ values: [Number.MAX_VALUE, Number.MAX_VALUE] }),
    ).toEqual({
      ok: true,
      output: { count: 2, deviation: 0, median: Number.MAX_VALUE },
    });
    expect(
      tool.execute({ values: [-Number.MAX_VALUE, Number.MAX_VALUE] }),
    ).toEqual({
      ok: true,
      output: { count: 2, deviation: Number.MAX_VALUE, median: 0 },
    });
  });
  it("preserves input and affine scaling", () => {
    const input = JSON.parse(
      JSON.stringify(example.input),
    ) as typeof example.input;
    tool.execute(input);
    expect(input).toEqual(example.input);
    expect(tool.execute({ values: [4, 6, 6, 10, 200] })).toEqual({
      ok: true,
      output: { count: 5, deviation: 2, median: 6 },
    });
  });
  it("rejects invalid data and unknown fields specifically", () => {
    for (const values of [[], [1, NaN], [1, Infinity], Array(513).fill(1)])
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
