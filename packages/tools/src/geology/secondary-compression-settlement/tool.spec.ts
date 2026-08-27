import { describe, expect, it } from "vitest";
import {
  secondaryCompressionSettlementExample,
  runSecondaryCompressionSettlement,
} from "./tool.js";

describe("secondary-compression-settlement", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runSecondaryCompressionSettlement(
        secondaryCompressionSettlementExample.input,
      ),
    ).toEqual({
      ok: true,
      output: secondaryCompressionSettlementExample.output,
    });
  });

  it("computes a one-log-cycle creep window", () => {
    const result = runSecondaryCompressionSettlement({
      layerThicknessM: 6,
      secondaryCompressionIndex: 0.002,
      endOfPrimaryVoidRatio: 0.9,
      startTimeYears: 10,
      endTimeYears: 100,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.settlementM as number).toBe(0.006315789473684211);
  });

  it("rejects an inverted creep window", () => {
    expect(
      runSecondaryCompressionSettlement({
        layerThicknessM: 4,
        secondaryCompressionIndex: 0.004,
        endOfPrimaryVoidRatio: 1,
        startTimeYears: 10,
        endTimeYears: 1,
      }).ok,
    ).toBe(false);
  });
});
