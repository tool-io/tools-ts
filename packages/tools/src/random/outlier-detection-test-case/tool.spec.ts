import { describe, expect, it } from "vitest";
import {
  matchesToolJsonSchema,
  validateToolContract,
} from "../../core/contract.js";
import tool, {
  outlierDetectionTestCaseExample as example,
  calculateOutlierDetectionTestCase,
} from "./tool.js";

describe("Random Outlier Detection Test Case Generator", () => {
  it("matches its canonical example and portable contract", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(calculateOutlierDetectionTestCase(example.input)).toEqual({
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
  it("has a known zero-spread baseline with one Tukey-fence outlier", () => {
    const result = tool.execute({
      baselineCount: 8,
      baselineMean: 0,
      baselineStandardDeviation: 0,
      contaminationCount: 1,
      contaminationOffset: 10,
      contaminationSide: "upper",
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.values.filter((value) => value === 0)).toHaveLength(8);
    expect(result.output.detectedCount).toBe(1);
    result.output.values.forEach((value, i) =>
      expect(result.output.injected[i]).toBe(value === 10),
    );
  });
  it("keeps injected labels separate when contaminated values are not statistical outliers", () => {
    const result = tool.execute({
      baselineCount: 4,
      baselineMean: 0,
      baselineStandardDeviation: 0,
      contaminationCount: 8,
      contaminationOffset: 10,
      contaminationSide: "upper",
      seed: 42,
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.injectedCount).toBe(8);
    expect(result.output.injected.filter(Boolean)).toHaveLength(8);
    expect(result.output.detectedCount).toBe(0);
    const none = tool.execute({
      ...example.input,
      baselineStandardDeviation: 0,
      contaminationCount: 0,
    });
    if (!none.ok) throw new Error("Expected success");
    expect(none.output.detectedCount).toBe(0);
  });
  it("retains exact counts, direction and finite arithmetic", () => {
    const result = tool.execute({
      ...example.input,
      contaminationSide: "lower",
    });
    if (!result.ok) throw new Error("Expected success");
    expect(result.output.values).toHaveLength(10);
    expect(result.output.injected.filter(Boolean)).toHaveLength(2);
    result.output.injected.forEach((flag, i) => {
      if (flag) expect(result.output.values[i]).toBe(60);
    });
    expect(
      tool.execute({
        ...example.input,
        baselineMean: 1e308,
        baselineStandardDeviation: 0,
        contaminationOffset: 1e308,
        contaminationSide: "upper",
      }),
    ).toMatchObject({
      ok: false,
      error: {
        issues: [{ field: "contaminationOffset", code: "numeric_overflow" }],
      },
    });
  });
});
