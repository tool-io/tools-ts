import { describe, expect, it } from "vitest";
import {
  cuttingsTransportVelocityExample,
  runCuttingsTransportVelocity,
} from "./tool.js";

describe("cuttings-transport-velocity", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runCuttingsTransportVelocity(cuttingsTransportVelocityExample.input),
    ).toEqual({
      ok: true,
      output: cuttingsTransportVelocityExample.output,
    });
  });

  it("carries weightless cuttings at the full annular velocity", () => {
    const result = runCuttingsTransportVelocity({
      annularVelocityMetresPerSecond: 1.5,
      particleSlipVelocityMetresPerSecond: 0,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.transportVelocityMetresPerSecond).toBe(1.5);
    expect(result.output.transportRatio).toBe(1);
  });

  it("rejects slip velocities at or above the annular velocity", () => {
    expect(
      runCuttingsTransportVelocity({
        annularVelocityMetresPerSecond: 0.3,
        particleSlipVelocityMetresPerSecond: 0.3,
      }).ok,
    ).toBe(false);
  });
});
