import { describe, expect, it } from "vitest";
import {
  fksHotspotScreenCheckerExample,
  fksHotspotScreenCheckerTool,
  runFksHotspotScreenChecker,
} from "./tool.js";

describe("FKS Hotspot Screen", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runFksHotspotScreenChecker(fksHotspotScreenCheckerExample.input),
    ).toEqual({
      ok: true,
      output: fksHotspotScreenCheckerExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(fksHotspotScreenCheckerExample))).toEqual(
      fksHotspotScreenCheckerExample,
    );
    expect(fksHotspotScreenCheckerTool.contractVersion).toBe(1);
    expect(fksHotspotScreenCheckerTool.execution).toEqual({ kind: "pure" });
  });

  it("raises the echinocandin screen flag when a mutation is detected", () => {
    const result = runFksHotspotScreenChecker({
      hotspotMutationDetected: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toEqual({
        echinocandinResistanceMarkerFlag: true,
        hotspotMutationDetected: true,
        interpretation:
          "An FKS hotspot variant was detected; interpret it by species and variant and correlate with antifungal susceptibility testing.",
      });
  });

  it("leaves the screen flag lowered without a mutation", () => {
    const result = runFksHotspotScreenChecker({
      hotspotMutationDetected: false,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output).toEqual({
        echinocandinResistanceMarkerFlag: false,
        hotspotMutationDetected: false,
        interpretation:
          "No FKS hotspot variant was detected by this screen; resistance is not excluded.",
      });
  });

  it("mirrors the detection input exactly into the flag", () => {
    const detected = runFksHotspotScreenChecker({
      hotspotMutationDetected: true,
    });
    const clear = runFksHotspotScreenChecker({
      hotspotMutationDetected: false,
    });
    if (!detected.ok || !clear.ok) throw new Error("expected success");
    expect(detected.output.echinocandinResistanceMarkerFlag).toBe(
      detected.output.hotspotMutationDetected,
    );
    expect(clear.output.echinocandinResistanceMarkerFlag).toBe(false);
  });

  it("rejects non-boolean detections", () => {
    expect(
      runFksHotspotScreenChecker({ hotspotMutationDetected: "yes" }).ok,
    ).toBe(false);
    expect(runFksHotspotScreenChecker({}).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runFksHotspotScreenChecker(null).ok).toBe(false);
    expect(
      runFksHotspotScreenChecker({
        ...fksHotspotScreenCheckerExample.input,
        flag: true,
      }).ok,
    ).toBe(false);
  });
});
