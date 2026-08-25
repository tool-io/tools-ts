import { describe, expect, it } from "vitest";
import {
  amyloidSporeWallClassifierExample,
  runAmyloidSporeWallClassifier,
} from "./tool.js";

describe("Amyloid Wall Classifier", () => {
  it("matches the canonical example", () => {
    expect(
      runAmyloidSporeWallClassifier(amyloidSporeWallClassifierExample.input),
    ).toEqual({
      ok: true,
      output: amyloidSporeWallClassifierExample.output,
    });
  });
  it("classifies inamyloid walls", () =>
    expect(runAmyloidSporeWallClassifier({ reaction: "inamyloid" })).toEqual({
      ok: true,
      output: {
        expectedIodineAppearance:
          "No amyloid or dextrinoid color reaction observed.",
        wallClassification: "Inamyloid",
      },
    }));
  it("classifies dextrinoid walls", () =>
    expect(runAmyloidSporeWallClassifier({ reaction: "dextrinoid" })).toEqual({
      ok: true,
      output: {
        expectedIodineAppearance:
          "Reddish-brown reaction in Melzer-type iodine reagent.",
        wallClassification: "Dextrinoid",
      },
    }));
  it("rejects unknown reactions", () =>
    expect(
      runAmyloidSporeWallClassifier({
        reaction: "negative",
      } as unknown as { reaction: "amyloid" }).ok,
    ).toBe(false));
  it("requires the reaction field", () =>
    expect(
      runAmyloidSporeWallClassifier({} as unknown as { reaction: "amyloid" })
        .ok,
    ).toBe(false));
});
