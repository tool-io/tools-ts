import { describe, expect, it } from "vitest";
import {
  malicAcidAdditionExample,
  malicAcidAdditionTool,
  runMalicAcidAddition,
} from "./tool.js";

describe("malicAcidAdditionTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMalicAcidAddition(malicAcidAdditionExample.input)).toEqual({
      ok: true,
      output: malicAcidAdditionExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(malicAcidAdditionExample))).toEqual(
      malicAcidAdditionExample,
    );
    expect(malicAcidAdditionTool.contractVersion).toBe(1);
    expect(malicAcidAdditionTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMalicAcidAddition(null).ok).toBe(false);
    expect(
      runMalicAcidAddition({
        ...malicAcidAdditionExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
