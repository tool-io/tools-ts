import { describe, expect, it } from "vitest";
import {
  calculateTriaNominaAnalyzer,
  runTriaNominaAnalyzer,
  triaNominaAnalyzerExample,
} from "./tool.js";

describe("epigraphy/tria-nomina-analyzer", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTriaNominaAnalyzer(triaNominaAnalyzerExample.input)).toEqual({
      ok: true,
      output: triaNominaAnalyzerExample.output,
    });
  });

  it("treats a bare cognomen as incomplete with score one", () => {
    expect(calculateTriaNominaAnalyzer({ name: "Cicero" })).toEqual({
      hasPraenomen: false,
      hasNomen: false,
      hasCognomen: true,
      completenessScore: 1,
      isComplete: false,
    });
  });

  it("recognizes full-form praenomina and missing cognomina", () => {
    expect(calculateTriaNominaAnalyzer({ name: "Gaius Iulius" })).toEqual({
      hasPraenomen: true,
      hasNomen: true,
      hasCognomen: false,
      completenessScore: 2,
      isComplete: false,
    });
  });

  it("rejects a blank name", () => {
    expect(runTriaNominaAnalyzer({ name: "  " }).ok).toBe(false);
  });
});
