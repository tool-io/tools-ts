import { describe, expect, it } from "vitest";
import {
  checkHaphazardSelectionBias,
  haphazardBiasWarningExample,
  runHaphazardBiasWarning,
} from "./tool.js";

describe("haphazard selection bias warning checker", () => {
  it("reproduces its canonical example", () => {
    expect(runHaphazardBiasWarning(haphazardBiasWarningExample.input)).toEqual({
      ok: true,
      output: haphazardBiasWarningExample.output,
    });
  });

  it("returns no warnings for supported random selection", () => {
    expect(
      checkHaphazardSelectionBias({
        populationComplete: true,
        randomnessEvidence: true,
        selectionMethod: "random",
        selectionReproducible: true,
        statisticalInferenceRequired: true,
      }),
    ).toMatchObject({ warningCount: 0, suitableForStatisticalInference: true });
  });

  it("lists an incomplete population and nonreproducible selection", () => {
    expect(
      checkHaphazardSelectionBias({
        populationComplete: false,
        randomnessEvidence: true,
        selectionMethod: "random",
        selectionReproducible: false,
        statisticalInferenceRequired: false,
      }).warnings,
    ).toEqual(["population_incomplete", "selection_not_reproducible"]);
  });

  it("rejects a malformed selection method", () => {
    expect(
      runHaphazardBiasWarning({
        populationComplete: true,
        randomnessEvidence: true,
        selectionMethod: "selected",
        selectionReproducible: true,
        statisticalInferenceRequired: false,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "selectionMethod" }] },
      ok: false,
    });
  });
});
