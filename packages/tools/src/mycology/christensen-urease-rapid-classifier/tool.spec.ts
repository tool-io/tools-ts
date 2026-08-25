import { describe, expect, it } from "vitest";
import {
  ureaseRapidClassifierExample,
  ureaseRapidClassifierTool,
  runUreaseRapidClassifier,
} from "./tool.js";

describe("Urease Rapid Classifier", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(
      runUreaseRapidClassifier(ureaseRapidClassifierExample.input),
    ).toEqual({
      ok: true,
      output: ureaseRapidClassifierExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(ureaseRapidClassifierExample))).toEqual(
      ureaseRapidClassifierExample,
    );
    expect(ureaseRapidClassifierTool.contractVersion).toBe(1);
    expect(ureaseRapidClassifierTool.execution).toEqual({ kind: "pure" });
  });

  it("passes rapid activity through unchanged", () => {
    const result = runUreaseRapidClassifier({ ureaseClass: "rapid-4h" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ureaseClass).toBe("rapid-4h");
  });

  it("passes negative activity through unchanged", () => {
    const result = runUreaseRapidClassifier({ ureaseClass: "negative" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ureaseClass).toBe("negative");
  });

  it("passes slow activity through unchanged", () => {
    const result = runUreaseRapidClassifier({ ureaseClass: "slow-24-72h" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.output.ureaseClass).toBe("slow-24-72h");
  });

  it("rejects classes outside the urease enum", () => {
    expect(runUreaseRapidClassifier({ ureaseClass: "slow-96h" }).ok).toBe(
      false,
    );
    expect(runUreaseRapidClassifier({ ureaseClass: "" }).ok).toBe(false);
  });

  it("returns structured errors for malformed input", () => {
    expect(runUreaseRapidClassifier(null).ok).toBe(false);
    expect(runUreaseRapidClassifier({ ureaseClass: 4 }).ok).toBe(false);
    expect(
      runUreaseRapidClassifier({
        ...ureaseRapidClassifierExample.input,
        hours: 24,
      }).ok,
    ).toBe(false);
  });
});
