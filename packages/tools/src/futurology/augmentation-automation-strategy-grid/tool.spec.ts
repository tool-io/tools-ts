import { describe, expect, it } from "vitest";
import {
  augmentationAutomationGridExample,
  classifyAugmentationAutomationGrid,
  runAugmentationAutomationGrid,
} from "./tool.js";

describe("augmentation and automation strategy grid", () => {
  it("reproduces its canonical example", () => {
    expect(
      runAugmentationAutomationGrid(augmentationAutomationGridExample.input),
    ).toEqual({
      ok: true,
      output: augmentationAutomationGridExample.output,
    });
  });

  it("classifies an automation position", () => {
    expect(
      classifyAugmentationAutomationGrid({
        augmentationScorePercent: 10,
        automationScorePercent: 90,
        gridThresholdPercent: 50,
      }).gridLabel,
    ).toBe("automation");
  });

  it("classifies an integration position", () => {
    expect(
      classifyAugmentationAutomationGrid({
        augmentationScorePercent: 80,
        automationScorePercent: 90,
        gridThresholdPercent: 50,
      }).gridLabel,
    ).toBe("integration");
  });

  it("rejects a grid value above 100", () => {
    expect(
      runAugmentationAutomationGrid({
        augmentationScorePercent: 0,
        automationScorePercent: 101,
        gridThresholdPercent: 50,
      }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_field", field: "automationScorePercent" }],
      },
      ok: false,
    });
  });
});
