import { describe, expect, it } from "vitest";
import {
  screwcapTorqueSpecExample,
  screwcapTorqueSpecTool,
  runScrewcapTorqueSpec,
} from "./tool.js";

describe("screwcapTorqueSpecTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runScrewcapTorqueSpec(screwcapTorqueSpecExample.input)).toEqual({
      ok: true,
      output: screwcapTorqueSpecExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(screwcapTorqueSpecExample))).toEqual(
      screwcapTorqueSpecExample,
    );
    expect(screwcapTorqueSpecTool.contractVersion).toBe(1);
    expect(screwcapTorqueSpecTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runScrewcapTorqueSpec(null).ok).toBe(false);
    expect(
      runScrewcapTorqueSpec({
        ...screwcapTorqueSpecExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });
});
