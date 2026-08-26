import { describe, expect, it } from "vitest";
import {
  divineMortalClassifierExample,
  runDivineMortalClassifier,
} from "./tool.js";

describe("divine-mortal-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDivineMortalClassifier(divineMortalClassifierExample.input),
    ).toEqual({
      ok: true,
      output: divineMortalClassifierExample.output,
    });
  });

  it("ranks a named deity above Manes formulas and classifies god tokens as divine", () => {
    const named = runDivineMortalClassifier({
      deityNamed: true,
      hasDativeCase: true,
      formulaWords: ["Dis", "Manibus"],
    });
    const deo = runDivineMortalClassifier({
      deityNamed: false,
      hasDativeCase: true,
      formulaWords: ["Deo", "Silvano"],
    });
    if (!named.ok || !deo.ok) throw new Error("expected success");
    expect(named.output.classification as string).toBe("divine");
    expect(deo.output.classification as string).toBe("divine");
    expect(deo.output.matchedEvidence as string).toBe("deo");
  });
  it("falls back to uncertain and rejects blank words", () => {
    const uncertain = runDivineMortalClassifier({
      deityNamed: false,
      hasDativeCase: false,
      formulaWords: [],
    });
    if (!uncertain.ok) throw new Error("expected success");
    expect(uncertain.output.classification as string).toBe("uncertain");
    expect(
      runDivineMortalClassifier({
        deityNamed: false,
        hasDativeCase: false,
        formulaWords: [" "],
      }).ok,
    ).toBe(false);
  });
});
