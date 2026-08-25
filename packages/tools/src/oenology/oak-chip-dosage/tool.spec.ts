import { describe, expect, it } from "vitest";
import {
  oakChipDosageExample,
  oakChipDosageTool,
  runOakChipDosage,
} from "./tool.js";

describe("oakChipDosageTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runOakChipDosage(oakChipDosageExample.input)).toEqual({
      ok: true,
      output: oakChipDosageExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(oakChipDosageExample))).toEqual(
      oakChipDosageExample,
    );
    expect(oakChipDosageTool.contractVersion).toBe(1);
    expect(oakChipDosageTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runOakChipDosage(null).ok).toBe(false);
    expect(
      runOakChipDosage({ ...oakChipDosageExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});
