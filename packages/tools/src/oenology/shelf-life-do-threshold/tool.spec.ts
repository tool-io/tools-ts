import { describe, expect, it } from "vitest";
import {
  shelfLifeDoThresholdExample,
  shelfLifeDoThresholdTool,
  runShelfLifeDoThreshold,
} from "./tool.js";

describe("shelfLifeDoThresholdTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runShelfLifeDoThreshold(shelfLifeDoThresholdExample.input)).toEqual({
      ok: true,
      output: shelfLifeDoThresholdExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(shelfLifeDoThresholdExample))).toEqual(
      shelfLifeDoThresholdExample,
    );
    expect(shelfLifeDoThresholdTool.contractVersion).toBe(1);
    expect(shelfLifeDoThresholdTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runShelfLifeDoThreshold(null).ok).toBe(false);
    expect(
      runShelfLifeDoThreshold({
        ...shelfLifeDoThresholdExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
