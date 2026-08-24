import { describe, expect, it } from "vitest";
import {
  historiatedInitialTierClassifierExample,
  runHistoriatedInitialTierClassifier,
} from "./tool.js";

describe("historiated-initial-tier-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runHistoriatedInitialTierClassifier(
        historiatedInitialTierClassifierExample.input,
      ),
    ).toEqual({
      ok: true,
      output: historiatedInitialTierClassifierExample.output,
    });
  });

  it("classes beasts-only initials as inhabited", () => {
    const result = runHistoriatedInitialTierClassifier({
      humanFigureCount: 0,
      animalFigureCount: 2,
      narrativeScene: false,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.tier).toBe("inhabited");
  });

  it("rejects negative figure counts", () => {
    expect(
      runHistoriatedInitialTierClassifier({
        humanFigureCount: -1,
        animalFigureCount: 0,
        narrativeScene: false,
      }).ok,
    ).toBe(false);
  });

  it("classes a non-narrative human figure as inhabited", () => {
    const result = runHistoriatedInitialTierClassifier({
      humanFigureCount: 1,
      animalFigureCount: 0,
      narrativeScene: false,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.tier).toBe("inhabited");
  });
});
