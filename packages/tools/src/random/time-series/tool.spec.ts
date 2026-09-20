import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  timeSeriesExample as example,
  calculateTimeSeries,
} from "./tool.js";

describe("Random Time Series Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateTimeSeries(example.input)).toEqual({
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
  it("has independently known noise-free increments and right-aligned averages", () => {
    const result = tool.execute({
      ...example.input,
      count: 4,
      driftPerStep: 2,
      noiseStandardDeviationPerStep: 0,
      windowSize: 2,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.values).toEqual([10, 12, 14, 16]);
    expect(result.output.increments).toEqual([2, 2, 2]);
    expect(result.output.timesSeconds).toEqual([0, 60, 120, 180]);
    expect(result.output.smoothedValues).toEqual([11, 13, 15]);
    expect(result.output.smoothedTimesSeconds).toEqual([60, 120, 180]);
    const single = tool.execute({ ...example.input, count: 1, windowSize: 1 });
    if (!single.ok) throw new Error("Expected success");
    expect(single.output.increments).toEqual([]);
    expect(single.output.values).toEqual([10]);
    expect(single.output.smoothedValues).toEqual([10]);
  });
  it("conserves every increment and rejects invalid windows, time grids and overflow", () => {
    const result = tool.execute(example.input);
    if (!result.ok) throw new Error("Expected success");
    result.output.increments.forEach((increment, i) =>
      expect(result.output.values[i + 1] - result.output.values[i]).toBeCloseTo(
        increment,
        12,
      ),
    );
    expect(tool.execute({ ...example.input, windowSize: 7 })).toMatchObject({
      ok: false,
      error: { issues: [{ field: "windowSize", code: "invalid_window" }] },
    });
    expect(
      tool.execute({
        ...example.input,
        startTimeSeconds: 1e308,
        timeStepSeconds: 1,
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [
          { field: "timeStepSeconds", code: "unrepresentable_time_grid" },
        ],
      },
    });
    expect(
      tool.execute({
        ...example.input,
        driftPerStep: 1e308,
        noiseStandardDeviationPerStep: 0,
      }),
    ).toMatchObject({
      ok: false,
      error: { issues: [{ field: "driftPerStep", code: "numeric_overflow" }] },
    });
  });
});
