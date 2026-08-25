import { describe, expect, it } from "vitest";
import { phTaBalanceExample, phTaBalanceTool, runPhTaBalance } from "./tool.js";

describe("phTaBalanceTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runPhTaBalance(phTaBalanceExample.input)).toEqual({
      ok: true,
      output: phTaBalanceExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(phTaBalanceExample))).toEqual(
      phTaBalanceExample,
    );
    expect(phTaBalanceTool.contractVersion).toBe(1);
    expect(phTaBalanceTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runPhTaBalance(null).ok).toBe(false);
    expect(
      runPhTaBalance({ ...phTaBalanceExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});

describe("ph ta balance boundaries", () => {
  it("reports pH and TA independently when both miss their ranges", () => {
    const result = runPhTaBalance({
      maximumPh: 3.6,
      maximumTaGPerL: 8.5,
      minimumPh: 3,
      minimumTaGPerL: 5.5,
      ph: 2.9,
      taGPerL: 10,
    });
    expect(result).toEqual({
      ok: true,
      output: {
        phStatus: "below_range",
        taStatus: "above_range",
        withinRanges: false,
      },
    });
  });
});
