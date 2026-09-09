import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
describe(tool.id, () => {
  it("calculates actual condition-specific mean mixing cost", () => {
    expect(calculate(example.input)).toEqual(example.output);
    expect(tool.execute(example.input)).toMatchObject({
      ok: true,
      output: example.output,
    });
  });
  it("publishes portable contracts/schemas", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("requires own fields without extra keys", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unexpected: true })).toMatchObject({
      ok: false,
    });
    expect(() => calculate(Object.create(example.input) as Input)).toThrow();
  });
  it("rejects null, nonfinite and wrong-type values", () => {
    for (const k of Object.keys(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
        ok: false,
      });
      expect(tool.execute({ ...example.input, [k]: [Infinity] })).toMatchObject(
        { ok: false },
      );
    }
  });
  it("retains inputs and is deterministic", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("rejects sparse, inherited and oversized observations", () => {
    for (const [k, v] of Object.entries(example.input)) {
      const sparse = Array(1);
      Object.setPrototypeOf(
        sparse,
        Object.assign(Object.create(Array.prototype), { 0: v[0] }),
      );
      expect(() =>
        calculate({ ...example.input, [k]: sparse } as unknown as Input),
      ).toThrow();
      expect(
        tool.execute({ ...example.input, [k]: Array(10001).fill(0) }),
      ).toMatchObject({ ok: false });
    }
  });
  it("rejects empty qualified reference and nonpositive latencies", () => {
    expect(
      tool.execute({ ...example.input, pureTrialValidCorrectFlags: [0, 0] }),
    ).toMatchObject({ ok: false });
    expect(
      tool.execute({
        ...example.input,
        actualPureBlockMatchedTrialTimesMs: [0, 600],
      }),
    ).toMatchObject({ ok: false });
  });
  it("preserves negative mixing costs and exclusions", () => {
    expect(
      calculate({
        ...example.input,
        actualPureBlockMatchedTrialTimesMs: [700, 900],
      }),
    ).toEqual({
      result: {
        observedMixedRepeatMeanMs: 600,
        observedPureTaskMeanMs: 800,
        signedObservedMixingCostMs: -200,
        includedMixedRepeatTrialCount: 2,
        includedPureTrialCount: 2,
        excludedMixedRepeatTrialIndices: [2],
        excludedPureTrialIndices: [],
      },
    });
  });
});
