import { describe, expect, it } from "vitest";
import {
  calculateMissioTypeTermClassifier,
  missioTypeTermClassifierExample,
  runMissioTypeTermClassifier,
} from "./tool.js";

describe("epigraphy/missio-type-term-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runMissioTypeTermClassifier(missioTypeTermClassifierExample.input),
    ).toEqual({ ok: true, output: missioTypeTermClassifierExample.output });
  });

  it("classifies honorable and dishonorable discharges case-insensitively", () => {
    expect(
      calculateMissioTypeTermClassifier({ text: "MISSIO HONESTA merita" }),
    ).toEqual({ classification: "honesta", matchedTerm: "HONESTA" });
    expect(
      calculateMissioTypeTermClassifier({
        text: "ignominiosa missio propter fugam",
      }),
    ).toEqual({ classification: "ignominiosa", matchedTerm: "ignominiosa" });
  });

  it("reports unknown when no discharge term appears", () => {
    expect(
      calculateMissioTypeTermClassifier({ text: "veteranus emeritus" }),
    ).toEqual({ classification: "unknown", matchedTerm: "" });
  });

  it("rejects blank text", () => {
    expect(runMissioTypeTermClassifier({ text: "" }).ok).toBe(false);
  });
});
