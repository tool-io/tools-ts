import { describe, expect, it } from "vitest";
import {
  ethylAcetateThresholdExample,
  ethylAcetateThresholdTool,
  runEthylAcetateThreshold,
} from "./tool.js";

describe("ethylAcetateThresholdTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runEthylAcetateThreshold(ethylAcetateThresholdExample.input),
    ).toEqual({
      ok: true,
      output: ethylAcetateThresholdExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(ethylAcetateThresholdExample))).toEqual(
      ethylAcetateThresholdExample,
    );
    expect(ethylAcetateThresholdTool.contractVersion).toBe(1);
    expect(ethylAcetateThresholdTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runEthylAcetateThreshold(null).ok).toBe(false);
    expect(
      runEthylAcetateThreshold({
        ...ethylAcetateThresholdExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
