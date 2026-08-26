import { describe, expect, it } from "vitest";
import {
  runTxTotalYearsLivedAbove,
  txTotalYearsLivedAboveExample,
} from "./tool.js";

describe("demography/tx-total-years-lived-above", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTxTotalYearsLivedAbove(txTotalYearsLivedAboveExample.input),
    ).toEqual({
      ok: true,
      output: txTotalYearsLivedAboveExample.output,
    });
  });

  it("sums a longer schedule in order", () => {
    const result = runTxTotalYearsLivedAbove({
      age: 85,
      personYearsLived: [2, 1.5],
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.totalYearsLived).toBe(3.5);
  });

  it("rejects an empty list and negative entries", () => {
    expect(runTxTotalYearsLivedAbove({ personYearsLived: [] }).ok).toBe(false);
    expect(runTxTotalYearsLivedAbove({ personYearsLived: [-1, 2] }).ok).toBe(
      false,
    );
  });
});
