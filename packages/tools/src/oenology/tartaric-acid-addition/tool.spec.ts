import { describe, expect, it } from "vitest";
import {
  tartaricAcidAdditionExample,
  tartaricAcidAdditionTool,
  runTartaricAcidAddition,
} from "./tool.js";

describe("tartaricAcidAdditionTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runTartaricAcidAddition(tartaricAcidAdditionExample.input)).toEqual({
      ok: true,
      output: tartaricAcidAdditionExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(tartaricAcidAdditionExample))).toEqual(
      tartaricAcidAdditionExample,
    );
    expect(tartaricAcidAdditionTool.contractVersion).toBe(1);
    expect(tartaricAcidAdditionTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTartaricAcidAddition(null).ok).toBe(false);
    expect(
      runTartaricAcidAddition({
        ...tartaricAcidAdditionExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
