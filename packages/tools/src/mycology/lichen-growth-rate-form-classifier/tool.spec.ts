import { describe, expect, it } from "vitest";
import { runLichenGrowthRateFormClassifier } from "./tool.js";
describe("Lichen Growth Form Rate", () => {
  it("records crustose growth", () =>
    expect(runLichenGrowthRateFormClassifier({ form: "crustose" })).toEqual({
      ok: true,
      output: { growthForm: "crustose" },
    }));
  it("records foliose growth", () =>
    expect(runLichenGrowthRateFormClassifier({ form: "foliose" })).toEqual({
      ok: true,
      output: { growthForm: "foliose" },
    }));
  it("records fruticose growth", () =>
    expect(runLichenGrowthRateFormClassifier({ form: "fruticose" })).toEqual({
      ok: true,
      output: { growthForm: "fruticose" },
    }));
  it("echoes the growth form unchanged", () => {
    const r = runLichenGrowthRateFormClassifier({ form: "crustose" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.growthForm).toBe("crustose");
  });
  it("accepts every supported form", () => {
    for (const form of ["crustose", "foliose", "fruticose"])
      expect(runLichenGrowthRateFormClassifier({ form }).ok).toBe(true);
  });
  it("rejects unsupported forms", () =>
    expect(runLichenGrowthRateFormClassifier({ form: "leprose" }).ok).toBe(
      false,
    ));
  it("rejects empty forms", () =>
    expect(runLichenGrowthRateFormClassifier({ form: "" }).ok).toBe(false));
});
