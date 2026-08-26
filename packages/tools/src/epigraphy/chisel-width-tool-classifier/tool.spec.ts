import { describe, expect, it } from "vitest";
import {
  chiselWidthToolClassifierExample,
  runChiselWidthToolClassifier,
} from "./tool.js";

describe("chisel-width-tool-classifier", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runChiselWidthToolClassifier(chiselWidthToolClassifierExample.input),
    ).toEqual({
      ok: true,
      output: chiselWidthToolClassifierExample.output,
    });
  });

  it("classifies boundary strokes as fine and broad", () => {
    const fine = runChiselWidthToolClassifier({ strokeWidthMm: 4.9 });
    if (!fine.ok) throw new Error("expected success");
    expect(fine.output.toolClass as string).toBe("fine");
    const broad = runChiselWidthToolClassifier({ strokeWidthMm: 15 });
    if (!broad.ok) throw new Error("expected success");
    expect(broad.output.toolClass as string).toBe("broad");
  });

  it("rejects inverted thresholds", () => {
    expect(
      runChiselWidthToolClassifier({
        strokeWidthMm: 7,
        fineToMediumMm: 20,
        mediumToBroadMm: 10,
      }).ok,
    ).toBe(false);
    expect(
      runChiselWidthToolClassifier({
        strokeWidthMm: 1,
        fineToMediumMm: -1,
        mediumToBroadMm: 2,
      }).ok,
    ).toBe(false);
  });
});
