import { describe, expect, it } from "vitest";
import {
  bustrophedonDirectionDetectorExample,
  calculateBustrophedonDirectionDetector,
  runBustrophedonDirectionDetector,
} from "./tool.js";

describe("epigraphy/bustrophedon-direction-detector", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBustrophedonDirectionDetector(
        bustrophedonDirectionDetectorExample.input,
      ),
    ).toEqual({
      ok: true,
      output: bustrophedonDirectionDetectorExample.output,
    });
  });

  it("rejects uniform direction sequences", () => {
    expect(
      calculateBustrophedonDirectionDetector({
        lineDirections: ["RTL", "rtl", " rtl "],
      }),
    ).toEqual({
      directionChanges: 0,
      alternates: false,
      isBustrophedon: false,
      firstLineDirection: "rtl",
    });
  });

  it("reports unknown tokens and empty input as invalid", () => {
    expect(
      runBustrophedonDirectionDetector({ lineDirections: ["diagonal"] }).ok,
    ).toBe(false);
    expect(runBustrophedonDirectionDetector({ lineDirections: [] }).ok).toBe(
      false,
    );
  });
});
