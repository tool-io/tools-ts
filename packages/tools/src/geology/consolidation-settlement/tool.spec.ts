import { describe, expect, it } from "vitest";
import {
  consolidationSettlementExample,
  runConsolidationSettlement,
} from "./tool.js";

describe("consolidation-settlement", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConsolidationSettlement(consolidationSettlementExample.input),
    ).toEqual({
      ok: true,
      output: consolidationSettlementExample.output,
    });
  });

  it("computes a representative stress doubling", () => {
    const result = runConsolidationSettlement({
      layerThicknessM: 5,
      initialVoidRatio: 0.8,
      compressionIndex: 0.4,
      initialEffectiveStressKpa: 100,
      finalEffectiveStressKpa: 400,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.settlementM as number).toBe(0.6689555459199582);
  });

  it("rejects unloading on the virgin curve", () => {
    expect(
      runConsolidationSettlement({
        layerThicknessM: 4,
        initialVoidRatio: 1,
        compressionIndex: 0.3,
        initialEffectiveStressKpa: 200,
        finalEffectiveStressKpa: 150,
      }).ok,
    ).toBe(false);
  });
});
