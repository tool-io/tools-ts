import { describe, expect, it } from "vitest";
import { runAmatoxinCapAssayClassifier } from "./tool.js";
describe("Amatoxin Cap Assay", () => {
  it("flags detected amatoxins as a potentially lethal risk", () =>
    expect(
      runAmatoxinCapAssayClassifier({ amatoxinPresent: "detected" }),
    ).toEqual({
      ok: true,
      output: {
        capAssayResult: "detected",
        potentiallyLethalRiskFlag: true,
        safetyGuidance:
          "Amatoxin detected: do not consume the specimen; suspected exposure requires urgent poison-control or medical guidance.",
      },
    }));
  it("clears not detected assays", () =>
    expect(
      runAmatoxinCapAssayClassifier({ amatoxinPresent: "not-detected" }),
    ).toEqual({
      ok: true,
      output: {
        capAssayResult: "not-detected",
        potentiallyLethalRiskFlag: false,
        safetyGuidance:
          "Amatoxin not detected: this result does not establish that the specimen is edible or free of other toxins.",
      },
    }));
  it("passes through the assay result unchanged", () => {
    const r = runAmatoxinCapAssayClassifier({
      amatoxinPresent: "not-detected",
    });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.capAssayResult).toBe("not-detected");
  });
  it("accepts every supported result", () => {
    for (const amatoxinPresent of ["detected", "not-detected"])
      expect(runAmatoxinCapAssayClassifier({ amatoxinPresent }).ok).toBe(true);
  });
  it("rejects unsupported results", () =>
    expect(runAmatoxinCapAssayClassifier({ amatoxinPresent: "trace" }).ok).toBe(
      false,
    ));
  it("rejects empty results", () =>
    expect(runAmatoxinCapAssayClassifier({ amatoxinPresent: "" }).ok).toBe(
      false,
    ));
});
