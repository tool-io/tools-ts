import { describe, expect, it } from "vitest";
import {
  fermaidDoseHlExample,
  fermaidDoseHlTool,
  runFermaidDoseHl,
} from "./tool.js";

describe("fermaidDoseHlTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runFermaidDoseHl(fermaidDoseHlExample.input)).toEqual({
      ok: true,
      output: fermaidDoseHlExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(fermaidDoseHlExample))).toEqual(
      fermaidDoseHlExample,
    );
    expect(fermaidDoseHlTool.contractVersion).toBe(1);
    expect(fermaidDoseHlTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runFermaidDoseHl(null).ok).toBe(false);
    expect(
      runFermaidDoseHl({ ...fermaidDoseHlExample.input, unexpectedField: 1 })
        .ok,
    ).toBe(false);
  });
});
