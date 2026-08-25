import { describe, expect, it } from "vitest";
import {
  fairyRingZoneClassifierExample,
  fairyRingZoneClassifierTool,
  runFairyRingZoneClassifier,
} from "./tool.js";

describe("Fairy Ring Zone Type", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runFairyRingZoneClassifier(fairyRingZoneClassifierExample.input),
    ).toEqual({
      ok: true,
      output: fairyRingZoneClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(fairyRingZoneClassifierExample))).toEqual(
      fairyRingZoneClassifierExample,
    );
    expect(fairyRingZoneClassifierTool.contractVersion).toBe(1);
    expect(fairyRingZoneClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes the lush zone through unchanged", () => {
    const result = runFairyRingZoneClassifier({ zone: "zone-1-lush" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.fairyRingZone).toBe("zone-1-lush");
  });

  it("passes the basidiocarps zone through unchanged", () => {
    const result = runFairyRingZoneClassifier({ zone: "zone-3-basidiocarps" });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.fairyRingZone).toBe("zone-3-basidiocarps");
  });

  it("passes the combined zone through unchanged", () => {
    const result = runFairyRingZoneClassifier({ zone: "combined-1-3" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.fairyRingZone).toBe("combined-1-3");
  });

  it("rejects zones outside the enum", () => {
    expect(runFairyRingZoneClassifier({ zone: "zone-4-dead" }).ok).toBe(false);
    expect(runFairyRingZoneClassifier({}).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runFairyRingZoneClassifier(null).ok).toBe(false);
    expect(runFairyRingZoneClassifier({ zone: 2 }).ok).toBe(false);
    expect(
      runFairyRingZoneClassifier({
        ...fairyRingZoneClassifierExample.input,
        ring: 1,
      }).ok,
    ).toBe(false);
  });
});
