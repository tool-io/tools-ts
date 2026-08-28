import { describe, expect, it } from "vitest";
import { runCriticalVolumeLookup } from "./tool.js";

describe("Critical Volume Lookup", () => {
  it("calculates a valid result", () => {
    const result = runCriticalVolumeLookup({ substance: "water" });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.criticalVolumeLMol).toBeDefined();
  });
  it("rejects invalid input", () =>
    expect(runCriticalVolumeLookup(null).ok).toBe(false));
  it("rejects an unknown substance", () =>
    expect(runCriticalVolumeLookup({ substance: "unobtainium" }).ok).toBe(
      false,
    ));
});
