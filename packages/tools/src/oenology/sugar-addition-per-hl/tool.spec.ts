import { describe, expect, it } from "vitest";
import {
  sugarAdditionPerHlExample,
  sugarAdditionPerHlTool,
  runSugarAdditionPerHl,
} from "./tool.js";

describe("sugarAdditionPerHlTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runSugarAdditionPerHl(sugarAdditionPerHlExample.input)).toEqual({
      ok: true,
      output: sugarAdditionPerHlExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(sugarAdditionPerHlExample))).toEqual(
      sugarAdditionPerHlExample,
    );
    expect(sugarAdditionPerHlTool.contractVersion).toBe(1);
    expect(sugarAdditionPerHlTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runSugarAdditionPerHl(null).ok).toBe(false);
    expect(
      runSugarAdditionPerHl({
        ...sugarAdditionPerHlExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
