import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example, type Input } from "./tool.js";
describe(tool.id, () => {
  it("matches actual partial/absolute and processing calculations", () => {
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
  it("rejects malformed nonfinite observations", () => {
    for (const k of Object.keys(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
        ok: false,
      });
    }
  });
  it("retains inputs and is deterministic", () => {
    const x = JSON.parse(JSON.stringify(example.input)) as Input,
      before = JSON.stringify(x);
    expect(calculate(x)).toEqual(calculate(x));
    expect(JSON.stringify(x)).toBe(before);
  });
  it("rejects sparse, inherited and oversized lists/matrices", () => {
    for (const [k, v] of Object.entries(example.input)) {
      const sparse = Array(1);
      Object.setPrototypeOf(
        sparse,
        Object.assign(Object.create(Array.prototype), { 0: v[0] }),
      );
      expect(() =>
        calculate({ ...example.input, [k]: sparse } as unknown as Input),
      ).toThrow();
      const oversized = Array(10001).fill(0);
      expect(tool.execute({ ...example.input, [k]: oversized })).toMatchObject({
        ok: false,
      });
    }
  });
  it("rejects impossible processing counts and unknown-only denominator", () => {
    expect(
      tool.execute({
        ...example.input,
        independentlyAssessedProcessingCorrectCounts: [3, 2],
      }),
    ).toMatchObject({ ok: false });
    expect(
      tool.execute({ ...example.input, setEvidenceKnownFlags: [0, 0] }),
    ).toMatchObject({ ok: false });
  });
  it("keeps missing sets as bounds, not failed recall", () => {
    expect(
      calculate({ ...example.input, setEvidenceKnownFlags: [1, 0] }),
    ).toEqual({
      result: {
        knownPartialCreditRecallScore: 2,
        knownAbsoluteCreditRecallScore: 2,
        maximumPossiblePartialCreditScore: 5,
        maximumPossibleAbsoluteCreditScore: 5,
        knownProcessingAccuracyPercent: 100,
        unknownSetIds: ["set-b"],
      },
    });
  });
});
it("regression: absolutecredit is not number-of-correct-items across incomplete sets", () => {
  expect(
    calculate({
      ...example.input,
      independentlyCodedSerialPositionRecallFlags: [
        [1, 0],
        [0, 1, 1],
      ],
    }).result,
  ).toMatchObject({
    knownPartialCreditRecallScore: 3,
    knownAbsoluteCreditRecallScore: 0,
  });
});
