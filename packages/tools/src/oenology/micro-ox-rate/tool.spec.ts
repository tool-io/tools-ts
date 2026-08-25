import { describe, expect, it } from "vitest";
import { microOxRateExample, microOxRateTool, runMicroOxRate } from "./tool.js";

describe("microOxRateTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMicroOxRate(microOxRateExample.input)).toEqual({
      ok: true,
      output: microOxRateExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(microOxRateExample))).toEqual(
      microOxRateExample,
    );
    expect(microOxRateTool.contractVersion).toBe(1);
    expect(microOxRateTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMicroOxRate(null).ok).toBe(false);
    expect(
      runMicroOxRate({ ...microOxRateExample.input, unexpectedField: 1 }).ok,
    ).toBe(false);
  });
});
