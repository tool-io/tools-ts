import { describe, expect, it } from "vitest";
import {
  hymenophoreTypeClassifierExample,
  hymenophoreTypeClassifierTool,
  runHymenophoreTypeClassifier,
} from "./tool.js";

describe("hymenophoreTypeClassifierTool", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHymenophoreTypeClassifier(hymenophoreTypeClassifierExample.input),
    ).toEqual({
      ok: true,
      output: hymenophoreTypeClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(hymenophoreTypeClassifierExample)),
    ).toEqual(hymenophoreTypeClassifierExample);
    expect(hymenophoreTypeClassifierTool.contractVersion).toBe(1);
    expect(hymenophoreTypeClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes through the lamellate and poroid types", () => {
    const lamellate = runHymenophoreTypeClassifier({ type: "lamellate" });
    const poroid = runHymenophoreTypeClassifier({ type: "poroid" });
    if (!lamellate.ok || !poroid.ok) throw new Error("expected success");
    expect(lamellate.output.hymenophoreClass).toBe("lamellate");
    expect(poroid.output.hymenophoreClass).toBe("poroid");
  });

  it("passes through the hydnoid and toothed types", () => {
    const hydnoid = runHymenophoreTypeClassifier({ type: "hydnoid" });
    const toothed = runHymenophoreTypeClassifier({ type: "toothed" });
    if (!hydnoid.ok || !toothed.ok) throw new Error("expected success");
    expect(hydnoid.output.hymenophoreClass).toBe("hydnoid");
    expect(toothed.output.hymenophoreClass).toBe("toothed");
  });

  it("passes through the smooth and folded types", () => {
    const smooth = runHymenophoreTypeClassifier({ type: "smooth" });
    const folded = runHymenophoreTypeClassifier({ type: "folded" });
    if (!smooth.ok || !folded.ok) throw new Error("expected success");
    expect(smooth.output.hymenophoreClass).toBe("smooth");
    expect(folded.output.hymenophoreClass).toBe("folded");
  });

  it("rejects unknown types", () => {
    expect(runHymenophoreTypeClassifier({ type: "ramal" }).ok).toBe(false);
    expect(runHymenophoreTypeClassifier({ type: "" }).ok).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(runHymenophoreTypeClassifier(null).ok).toBe(false);
    expect(runHymenophoreTypeClassifier({ type: null }).ok).toBe(false);
    expect(
      runHymenophoreTypeClassifier({
        ...hymenophoreTypeClassifierExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
