import { describe, expect, it } from "vitest";
import {
  hairPerforationClassifierExample,
  hairPerforationClassifierTool,
  runHairPerforationClassifier,
} from "./tool.js";

describe("Hair Perforation Classifier", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runHairPerforationClassifier(hairPerforationClassifierExample.input),
    ).toEqual({
      ok: true,
      output: hairPerforationClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(
      JSON.parse(JSON.stringify(hairPerforationClassifierExample)),
    ).toEqual(hairPerforationClassifierExample);
    expect(hairPerforationClassifierTool.contractVersion).toBe(1);
    expect(hairPerforationClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("maps present perforations to the positive class", () => {
    const result = runHairPerforationClassifier({
      perforationsObserved: "present",
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.perforationClass).toBe("positive-perforation");
  });

  it("maps absent perforations to the negative class", () => {
    const result = runHairPerforationClassifier({
      perforationsObserved: "absent",
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.perforationClass).toBe("negative-perforation");
  });

  it("accepts only the two observation values", () => {
    expect(
      runHairPerforationClassifier({ perforationsObserved: "none" }).ok,
    ).toBe(false);
    expect(runHairPerforationClassifier({}).ok).toBe(false);
  });

  it("rejects non-string observations", () => {
    expect(
      runHairPerforationClassifier({ perforationsObserved: true }).ok,
    ).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runHairPerforationClassifier(null).ok).toBe(false);
    expect(
      runHairPerforationClassifier({
        ...hairPerforationClassifierExample.input,
        count: 1,
      }).ok,
    ).toBe(false);
  });
});
