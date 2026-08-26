import { describe, expect, it } from "vitest";
import {
  reliefDepthBandClassifierExample,
  runReliefDepthBandClassifier,
} from "./tool.js";

describe("relief-depth-band-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReliefDepthBandClassifier(reliefDepthBandClassifierExample.input),
    ).toEqual({
      ok: true,
      output: reliefDepthBandClassifierExample.output,
    });
  });

  it("bands boundary depths as medium and deep", () => {
    const shallow = runReliefDepthBandClassifier({ depthMm: 1.9 });
    if (!shallow.ok) throw new Error("expected success");
    expect(shallow.output.band as string).toBe("shallow");
    const medium = runReliefDepthBandClassifier({ depthMm: 2 });
    if (!medium.ok) throw new Error("expected success");
    expect(medium.output.band as string).toBe("medium");
    const deep = runReliefDepthBandClassifier({ depthMm: 10 });
    if (!deep.ok) throw new Error("expected success");
    expect(deep.output.band as string).toBe("deep");
  });

  it("rejects inverted thresholds", () => {
    expect(
      runReliefDepthBandClassifier({
        depthMm: 1,
        shallowToMediumMm: 5,
        mediumToDeepMm: 5,
      }).ok,
    ).toBe(false);
    expect(
      runReliefDepthBandClassifier({
        depthMm: 1,
        shallowToMediumMm: -1,
        mediumToDeepMm: 5,
      }).ok,
    ).toBe(false);
  });
});
