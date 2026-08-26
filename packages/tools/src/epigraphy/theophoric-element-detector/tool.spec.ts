import { describe, expect, it } from "vitest";
import {
  runTheophoricElementDetector,
  theophoricElementDetectorExample,
} from "./tool.js";

describe("theophoric-element-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runTheophoricElementDetector(theophoricElementDetectorExample.input),
    ).toEqual({
      ok: true,
      output: theophoricElementDetectorExample.output,
    });
  });

  it("prefers longer stems over shorter collisions", () => {
    const r = runTheophoricElementDetector({ name: "Herakleides" });
    if (!r.ok) throw new Error("expected success");
    expect(r.output.matchedStem as string).toBe("herakl");
  });
  it("reports non-theophoric names and rejects empty input", () => {
    expect(runTheophoricElementDetector({ name: "Valerius" })).toEqual({
      ok: true,
      output: { isTheophoric: false, matchedStem: "", deity: "" },
    });
    expect(runTheophoricElementDetector({ name: "  " }).ok).toBe(false);
  });
});
