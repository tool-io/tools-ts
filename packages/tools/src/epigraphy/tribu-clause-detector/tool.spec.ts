import { describe, expect, it } from "vitest";
import {
  calculateTribuClauseDetector,
  runTribuClauseDetector,
  tribuClauseDetectorExample,
} from "./tool.js";

describe("epigraphy/tribu-clause-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runTribuClauseDetector(tribuClauseDetectorExample.input)).toEqual({
      ok: true,
      output: tribuClauseDetectorExample.output,
    });
  });

  it("detects inverted 'tribu Galeria' order", () => {
    const result = calculateTribuClauseDetector({
      text: "P. Licinius P. f. tribu Galeria aedilis",
    });
    expect(result.found).toBe(true);
    expect(result.tribeName).toBe("Galeria");
    expect(result.clause).toBe("tribu Galeria");
    expect(calculateTribuClauseDetector({ text: "GALERIA TRIBU" })).toEqual({
      found: true,
      tribeName: "GALERIA",
      clause: "GALERIA TRIBU",
    });
  });

  it("reports not-found for text without a tribe clause", () => {
    expect(
      calculateTribuClauseDetector({ text: "dis manibus sacrum" }),
    ).toEqual({ found: false, tribeName: "", clause: "" });
  });

  it("rejects blank text", () => {
    expect(runTribuClauseDetector({ text: "" }).ok).toBe(false);
  });
});
