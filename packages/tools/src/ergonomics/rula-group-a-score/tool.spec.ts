import { describe, expect, it } from "vitest";
import {
  validateToolContract,
  matchesToolJsonSchema,
} from "../../core/contract.js";
import tool, { calculate, example } from "./tool.js";
const close = (actual: unknown, expected: unknown): void => {
  if (typeof expected === "number") {
    expect(typeof actual).toBe("number");
    expect(Math.abs((actual as number) - expected)).toBeLessThanOrEqual(
      Math.max(1, Math.abs(expected)) * 1e-8,
    );
  } else if (Array.isArray(expected)) {
    expect(Array.isArray(actual)).toBe(true);
    expect((actual as unknown[]).length).toBe(expected.length);
    expected.forEach((v, i) => close((actual as unknown[])[i], v));
  } else if (expected !== null && typeof expected === "object") {
    expect(Object.keys(actual as object).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [k, v] of Object.entries(expected))
      close((actual as Record<string, unknown>)[k], v);
  } else expect(actual).toEqual(expected);
};
describe(tool.id, () => {
  it("addresses last posture row/column without confusing score adjustments", () => {
    const callerGroupATable = example.input.callerGroupATable.map((r) => [
      ...r,
    ]);
    callerGroupATable[17][7] = 7;
    close(
      calculate({
        ...example.input,
        upperArmPostureScore: 6,
        lowerArmPostureScore: 3,
        wristPostureScore: 4,
        wristTwistScore: 2,
        callerGroupATable,
      }),
      {
        callerTablePostureScoreA: 7,
        adjustedScoreA: 10,
        tableRowIndex: 17,
        tableColumnIndex: 7,
      },
    );
  });
  it("rejects malformed or fractional caller table scores", () => {
    const table = example.input.callerGroupATable.map((r) => [...r]);
    table[0][0] = 2.5;
    for (const callerGroupATable of [table, [[1]]])
      expect(
        tool.execute({ ...example.input, callerGroupATable }),
      ).toMatchObject({ ok: false });
  });
  it("computes independent canonical results", () => {
    close(calculate(example.input), example.output);
    const result = tool.execute(example.input);
    expect(result.ok).toBe(true);
    if (result.ok) close(result.output, example.output);
  });
  it("publishes valid contracts and portable examples", () => {
    expect(validateToolContract(tool)).toEqual([]);
    expect(matchesToolJsonSchema(example.input, tool.inputSchema)).toBe(true);
    expect(matchesToolJsonSchema(example.output, tool.outputSchema)).toBe(true);
  });
  it("rejects missing and unknown inputs", () => {
    expect(tool.execute({})).toMatchObject({ ok: false });
    expect(tool.execute({ ...example.input, unknown: true })).toMatchObject({
      ok: false,
    });
  });
  it("rejects malformed and nonfinite fields", () => {
    for (const [k, v] of Object.entries(example.input)) {
      expect(tool.execute({ ...example.input, [k]: null })).toMatchObject({
        ok: false,
      });
      if (typeof v === "number") {
        expect(tool.execute({ ...example.input, [k]: Infinity })).toMatchObject(
          { ok: false },
        );
        expect(() => calculate({ ...example.input, [k]: NaN })).toThrow();
      }
      if (Array.isArray(v))
        expect(tool.execute({ ...example.input, [k]: [NaN] })).toMatchObject({
          ok: false,
        });
    }
  });
  it("rejects invalid domains and unbounded requests", () => {
    const input = { ...example.input, wristTwistScore: 3 };
    expect(() => calculate(input)).toThrow();
    expect(tool.execute(input)).toMatchObject({ ok: false });
  });
  it("handles independent boundary scenario", () => {
    const input = {
      ...example.input,
      muscleUseAdjustment: 0,
      forceLoadAdjustment: 0,
    };
    close(calculate(input), {
      callerTablePostureScoreA: 2,
      adjustedScoreA: 2,
      tableRowIndex: 0,
      tableColumnIndex: 0,
    });
    const result = tool.execute(input);
    expect(result.ok).toBe(true);
    if (result.ok)
      close(result.output, {
        callerTablePostureScoreA: 2,
        adjustedScoreA: 2,
        tableRowIndex: 0,
        tableColumnIndex: 0,
      });
  });
});
