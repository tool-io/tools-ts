import { describe, expect, it } from "vitest";
import {
  heatSpikeRiskExample,
  heatSpikeRiskTool,
  runHeatSpikeRisk,
} from "./tool.js";

describe("heatSpikeRiskTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runHeatSpikeRisk(heatSpikeRiskExample.input)).toEqual({
      ok: true,
      output: heatSpikeRiskExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(heatSpikeRiskExample))).toEqual(
      heatSpikeRiskExample,
    );
    expect(heatSpikeRiskTool.contractVersion).toBe(1);
    expect(heatSpikeRiskTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runHeatSpikeRisk(null).ok).toBe(false);
    expect(
      runHeatSpikeRisk({ ...heatSpikeRiskExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});
