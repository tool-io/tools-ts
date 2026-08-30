import { describe, expect, it } from "vitest";
import {
  causalLayeredAnalysisExample,
  mapCausalLayeredAnalysis,
  runCausalLayeredAnalysis,
} from "./tool.js";

describe("causal layered analysis", () => {
  it("reproduces its canonical example", () => {
    expect(
      runCausalLayeredAnalysis(causalLayeredAnalysisExample.input),
    ).toEqual({
      ok: true,
      output: causalLayeredAnalysisExample.output,
    });
  });

  it("orders all four layers from surface to depth", () => {
    expect(
      mapCausalLayeredAnalysis({
        litany: "A",
        mythOrMetaphor: "D",
        socialSystemCauses: "B",
        worldviewOrDiscourse: "C",
      }).layerSequence,
    ).toEqual([
      "Litany: A",
      "Social or system causes: B",
      "Worldview or discourse: C",
      "Myth or metaphor: D",
    ]);
  });

  it("rejects an empty layer", () => {
    expect(
      runCausalLayeredAnalysis({
        litany: "A",
        mythOrMetaphor: " ",
        socialSystemCauses: "B",
        worldviewOrDiscourse: "C",
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_layer_content", field: "mythOrMetaphor" }],
      },
      ok: false,
    });
  });
});
