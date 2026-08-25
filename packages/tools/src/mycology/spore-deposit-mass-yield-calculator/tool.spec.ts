import { describe, expect, it } from "vitest";
import {
  sporeDepositYieldCalculatorExample,
  sporeDepositYieldCalculatorTool,
  runSporeDepositYieldCalculator,
} from "./tool.js";

describe("Spore Deposit Yield", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runSporeDepositYieldCalculator(sporeDepositYieldCalculatorExample.input),
    ).toEqual({
      ok: true,
      output: sporeDepositYieldCalculatorExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(sporeDepositYieldCalculatorExample)),
    ).toEqual(sporeDepositYieldCalculatorExample);
    expect(sporeDepositYieldCalculatorTool.contractVersion).toBe(1);
    expect(sporeDepositYieldCalculatorTool.execution).toEqual({ kind: "pure" });
  });

  it("records a zero yield for an empty deposit", () => {
    const result = runSporeDepositYieldCalculator({
      collectionHoursInt: 5,
      depositMassMg: 0,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.sporeDepositMgPerHour).toBe(0);
  });

  it("divides deposit mass by collection hours exactly", () => {
    const result = runSporeDepositYieldCalculator({
      collectionHoursInt: 12,
      depositMassMg: 90,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.sporeDepositMgPerHour).toBeCloseTo(7.5, 12);
  });

  it("accepts a single hour of collection", () => {
    const result = runSporeDepositYieldCalculator({
      collectionHoursInt: 1,
      depositMassMg: 42,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.sporeDepositMgPerHour).toBe(42);
  });

  it("rejects negative mass and zero or negative hours", () => {
    expect(
      runSporeDepositYieldCalculator({
        collectionHoursInt: 8,
        depositMassMg: -1,
      }).ok,
    ).toBe(false);
    expect(
      runSporeDepositYieldCalculator({
        collectionHoursInt: 0,
        depositMassMg: 10,
      }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runSporeDepositYieldCalculator(null).ok).toBe(false);
    expect(runSporeDepositYieldCalculator({ depositMassMg: 120 }).ok).toBe(
      false,
    );
    expect(
      runSporeDepositYieldCalculator({
        collectionHoursInt: 1.5,
        depositMassMg: 30,
      }).ok,
    ).toBe(false);
  });
});
