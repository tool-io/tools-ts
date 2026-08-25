import { describe, expect, it } from "vitest";
import {
  totalPackageOxygenExample,
  totalPackageOxygenTool,
  runTotalPackageOxygen,
} from "./tool.js";

describe("totalPackageOxygenTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runTotalPackageOxygen(totalPackageOxygenExample.input)).toEqual({
      ok: true,
      output: totalPackageOxygenExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(totalPackageOxygenExample))).toEqual(
      totalPackageOxygenExample,
    );
    expect(totalPackageOxygenTool.contractVersion).toBe(1);
    expect(totalPackageOxygenTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runTotalPackageOxygen(null).ok).toBe(false);
    expect(
      runTotalPackageOxygen({
        ...totalPackageOxygenExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
