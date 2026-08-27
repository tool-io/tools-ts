import { describe, expect, it } from "vitest";
import {
  cooperJacobTransmissivityExample,
  runCooperJacobTransmissivity,
} from "./tool.js";

describe("cooper-jacob-transmissivity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCooperJacobTransmissivity(cooperJacobTransmissivityExample.input),
    ).toEqual({
      ok: true,
      output: cooperJacobTransmissivityExample.output,
    });
  });

  it("halves transmissivity when drawdown per cycle doubles", () => {
    const result = runCooperJacobTransmissivity({
      dischargeM3PerDay: 1000,
      drawdownPerLogCycleM: 1.8,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.transmissivityM2PerDay as number).toBe(
      101.79661095547609,
    );
  });

  it("rejects non-positive drawdown per log cycle", () => {
    expect(
      runCooperJacobTransmissivity({
        dischargeM3PerDay: 1000,
        drawdownPerLogCycleM: 0,
      }).ok,
    ).toBe(false);
  });
});
