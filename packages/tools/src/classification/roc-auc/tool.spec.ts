import { describe, expect, it } from "vitest";
import { calculateRocAuc, rocAucExample, runRocAuc } from "./tool.js";

describe("classification/roc-auc", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runRocAuc(rocAucExample.input)).toEqual({
      ok: true,
      output: rocAucExample.output,
    });
  });

  it("rejects empty, mismatched and invalid inputs with structured errors", () => {
    expect(runRocAuc({ labels: [], scores: [] }).ok).toBe(false);
    const mismatch = runRocAuc({ labels: [1], scores: [0.5, 0.4] });
    expect(mismatch.ok).toBe(false);
    if (!mismatch.ok)
      expect(mismatch.error.issues[0]?.code).toBe("length_mismatch");
    const badLabel = runRocAuc({ labels: [1, 2], scores: [0.5, 0.4] });
    expect(badLabel.ok).toBe(false);
    if (!badLabel.ok)
      expect(badLabel.error.issues[0]?.code).toBe("invalid_label");
    const oneClass = runRocAuc({ labels: [1, 1], scores: [0.5, 0.4] });
    expect(oneClass.ok).toBe(false);
    if (!oneClass.ok)
      expect(oneClass.error.issues[0]?.code).toBe("missing_class");
  });

  it("treats fully tied scores as a random classifier (auc 0.5)", () => {
    const result = calculateRocAuc({
      labels: [1, 0],
      scores: [0.5, 0.5],
    });
    expect(result.auc).toBeCloseTo(0.5, 12);
  });

  it("scores a perfect ranking as 1", () => {
    const result = calculateRocAuc({
      labels: [1, 1, 0, 0],
      scores: [0.9, 0.8, 0.2, 0.1],
    });
    expect(result.auc).toBeCloseTo(1, 12);
  });
});
