import { describe, expect, it } from "vitest";
import { reeAnomalyEuExample, runReeAnomalyEu } from "./tool.js";

describe("ree-anomaly-eu", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReeAnomalyEu(reeAnomalyEuExample.input)).toEqual({
      ok: true,
      output: reeAnomalyEuExample.output,
    });
  });

  it("returns exactly one for chondritic input", () => {
    const result = runReeAnomalyEu({
      samariumPpm: 0.148,
      europiumPpm: 0.0563,
      gadoliniumPpm: 0.199,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.europiumAnomaly as number).toBe(1);
  });
  it("rejects non-positive concentrations", () => {
    expect(
      runReeAnomalyEu({ samariumPpm: 1, europiumPpm: 0, gadoliniumPpm: 1 }).ok,
    ).toBe(false);
  });
});
