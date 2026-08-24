import { describe, expect, it } from "vitest";
import {
  kurrentCenturyClassifierExample,
  runKurrentCenturyClassifier,
} from "./tool.js";

describe("kurrent-century-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runKurrentCenturyClassifier(kurrentCenturyClassifierExample.input),
    ).toEqual({ ok: true, output: kurrentCenturyClassifierExample.output });
  });

  it("places the twentieth century in the Sütterlin band", () => {
    const result = runKurrentCenturyClassifier({ century: 20 });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.kurrentPhase as string).toBe(
      "suetterlin_and_kurrent_end",
    );
  });

  it("rejects non-positive centuries", () => {
    expect(runKurrentCenturyClassifier({ century: 0 }).ok).toBe(false);
    expect(runKurrentCenturyClassifier({ century: 22 }).ok).toBe(false);
  });
});
