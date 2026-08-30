import { describe, expect, it } from "vitest";
import {
  classifySamplingSelection,
  runSamplingSelection,
  samplingSelectionExample,
} from "./tool.js";

describe("sampling selection classifier", () => {
  it("reproduces its canonical example", () => {
    expect(runSamplingSelection(samplingSelectionExample.input)).toEqual({
      ok: true,
      output: samplingSelectionExample.output,
    });
  });

  it("marks haphazard selection high risk", () => {
    expect(
      classifySamplingSelection({
        populationComplete: true,
        selectionMethod: "haphazard",
        selectionReproducible: true,
        statisticalInferenceRequired: false,
      }).risk,
    ).toBe("high");
  });

  it("does not claim statistical suitability for nonprobability selection", () => {
    expect(
      classifySamplingSelection({
        populationComplete: true,
        selectionMethod: "judgment",
        selectionReproducible: true,
        statisticalInferenceRequired: true,
      }).suitableForStatisticalInference,
    ).toBe(false);
  });

  it("rejects an unsupported selection method", () => {
    expect(
      runSamplingSelection({
        populationComplete: true,
        selectionMethod: "convenient",
        selectionReproducible: true,
        statisticalInferenceRequired: false,
      }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_field", field: "selectionMethod" }] },
      ok: false,
    });
  });
});
