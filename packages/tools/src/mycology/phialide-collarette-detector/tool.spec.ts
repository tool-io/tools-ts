import { describe, expect, it } from "vitest";
import {
  phialideCollaretteDetectorExample,
  runPhialideCollaretteDetector,
} from "./tool.js";
describe("Collarette Detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runPhialideCollaretteDetector(phialideCollaretteDetectorExample.input),
    ).toEqual({
      ok: true,
      output: phialideCollaretteDetectorExample.output,
    });
  });
  it("marks an absent collarette as not visible", () => {
    expect(runPhialideCollaretteDetector({ collarette: "absent" })).toEqual({
      ok: true,
      output: { collaretteState: "absent", visible: false },
    });
  });
  it("rejects invalid input", () => {
    expect(
      runPhialideCollaretteDetector({
        collarette: "unknown" as unknown as "absent",
      }).ok,
    ).toBe(false);
  });
});
