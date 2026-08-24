import { describe, expect, it } from "vitest";
import { runSignumCrossDetector, signumCrossDetectorExample } from "./tool.js";

describe("signum-cross-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runSignumCrossDetector(signumCrossDetectorExample.input)).toEqual({
      ok: true,
      output: signumCrossDetectorExample.output,
    });
  });

  it("reports no marks for plain prose", () => {
    expect(
      runSignumCrossDetector({ charterText: "Nulla signa in hoc textu." }),
    ).toEqual({
      ok: true,
      output: { crossCount: 0, hasSignumMarks: false, firstCrossIndex: -1 },
    });
  });

  it("rejects empty text", () => {
    expect(runSignumCrossDetector({ charterText: "" }).ok).toBe(false);
  });
});
