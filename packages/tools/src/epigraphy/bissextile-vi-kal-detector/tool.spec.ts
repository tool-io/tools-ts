import { describe, expect, it } from "vitest";
import {
  bissextileViKalDetectorExample,
  calculateBissextileViKalDetector,
  runBissextileViKalDetector,
} from "./tool.js";

describe("epigraphy/bissextile-vi-kal-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBissextileViKalDetector(bissextileViKalDetectorExample.input),
    ).toEqual({ ok: true, output: bissextileViKalDetectorExample.output });
  });

  it("flags the plain sixth day before the March kalends without doubling", () => {
    expect(
      calculateBissextileViKalDetector({ text: "a.d. VI Kal. Mart." }),
    ).toEqual({ found: true, occurrenceCount: 1, doubledForm: false });
  });

  it("reports not-found for ordinary dates", () => {
    expect(
      calculateBissextileViKalDetector({ text: "a.d. VII Id. Apr." }),
    ).toEqual({ found: false, occurrenceCount: 0, doubledForm: false });
  });

  it("rejects blank text", () => {
    expect(runBissextileViKalDetector({ text: "" }).ok).toBe(false);
  });
});
