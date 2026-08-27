import { describe, expect, it } from "vitest";
import { reeAnomalyCeExample, runReeAnomalyCe } from "./tool.js";

describe("ree-anomaly-ce", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runReeAnomalyCe(reeAnomalyCeExample.input)).toEqual({
      ok: true,
      output: reeAnomalyCeExample.output,
    });
  });

  it("returns exactly one for chondritic input", () => {
    const result = runReeAnomalyCe({
      lanthanumPpm: 0.237,
      ceriumPpm: 0.613,
      praseodymiumPpm: 0.0932,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.ceriumAnomaly as number).toBe(1);
  });
  it("rejects non-positive concentrations", () => {
    expect(
      runReeAnomalyCe({ lanthanumPpm: -1, ceriumPpm: 1, praseodymiumPpm: 1 })
        .ok,
    ).toBe(false);
  });
});
