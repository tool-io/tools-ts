import { describe, expect, it } from "vitest";
import {
  multiTankWeightedAbvExample,
  multiTankWeightedAbvTool,
  runMultiTankWeightedAbv,
} from "./tool.js";

describe("multiTankWeightedAbvTool", () => {
  it("executes its canonical example to the exact published output", () => {
    expect(runMultiTankWeightedAbv(multiTankWeightedAbvExample.input)).toEqual({
      ok: true,
      output: multiTankWeightedAbvExample.output,
    });
  });

  it("keeps the example portable across JSON", () => {
    expect(JSON.parse(JSON.stringify(multiTankWeightedAbvExample))).toEqual(
      multiTankWeightedAbvExample,
    );
    expect(multiTankWeightedAbvTool.contractVersion).toBe(1);
    expect(multiTankWeightedAbvTool.execution).toEqual({ kind: "pure" });
  });

  it("returns structured errors for malformed input", () => {
    expect(runMultiTankWeightedAbv(null).ok).toBe(false);
    expect(
      runMultiTankWeightedAbv({
        ...multiTankWeightedAbvExample.input,
        unexpectedField: 1,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative volumes and impossible ABV values", () => {
    expect(
      runMultiTankWeightedAbv({
        tankAbvPercents: [12, 101],
        tankVolumesLiters: [100, 100],
      }).ok,
    ).toBe(false);
    expect(
      runMultiTankWeightedAbv({
        tankAbvPercents: [12, 13],
        tankVolumesLiters: [100, -1],
      }).ok,
    ).toBe(false);
  });
});
