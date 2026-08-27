import { describe, expect, it } from "vitest";
import {
  bjtCollectorCurrentExample,
  calculateBjtCollectorCurrent,
  runBjtCollectorCurrent,
} from "./tool.js";

describe("BJT Collector Current", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runBjtCollectorCurrent(bjtCollectorCurrentExample.input)).toEqual({
      ok: true,
      output: bjtCollectorCurrentExample.output,
    });
  });

  it("rejects non-positive beta", () => {
    expect(
      runBjtCollectorCurrent({ baseCurrentA: 0.00001, betaHfe: 0 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_beta" }] },
      ok: false,
    });
  });

  it("doubles collector current when beta doubles", () => {
    expect(
      calculateBjtCollectorCurrent({ baseCurrentA: 0.00001, betaHfe: 200 })
        .collectorCurrentA,
    ).toBe(bjtCollectorCurrentExample.output.collectorCurrentA * 2);
  });
});
