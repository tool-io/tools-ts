import { describe, expect, it } from "vitest";
import {
  crystalMaterialExample,
  lookupWatchCrystalMaterial,
  runCrystalMaterial,
} from "./tool.js";

describe("watch crystal material comparison lookup", () => {
  it("reproduces the canonical acrylic example", () => {
    expect(runCrystalMaterial(crystalMaterialExample.input)).toEqual({
      ok: true,
      output: crystalMaterialExample.output,
    });
  });

  it("contrasts mineral glass with sapphire", () => {
    expect(
      lookupWatchCrystalMaterial({ materialFocus: "mineral" }).properties,
    ).toContain("not as scratch-resistant");
    expect(
      lookupWatchCrystalMaterial({ materialFocus: "sapphire" }).properties,
    ).toContain("highly scratch-resistant");
  });

  it("describes acrylic as comparatively easy to repolish", () => {
    expect(
      lookupWatchCrystalMaterial({ materialFocus: "acrylic" }).properties,
    ).toContain("easy to repolish");
  });

  it("keeps transition dates model-specific", () => {
    expect(
      lookupWatchCrystalMaterial({ materialFocus: "datingCaution" }).keyDate,
    ).toBe("model-specific");
  });

  it("rejects an unsupported focus at the public boundary", () => {
    expect(runCrystalMaterial({ materialFocus: "mineralGlass" })).toMatchObject(
      {
        error: { issues: [{ code: "invalid_field", field: "materialFocus" }] },
        ok: false,
      },
    );
  });
});
