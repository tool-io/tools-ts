import { describe, expect, it } from "vitest";
import {
  reeferSetpointTempModeLookupExample,
  runReeferSetpointTempModeLookup,
} from "./tool.js";

describe("reefer-setpoint-temp-mode-lookup", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runReeferSetpointTempModeLookup(
        reeferSetpointTempModeLookupExample.input,
      ),
    ).toEqual({
      ok: true,
      output: reeferSetpointTempModeLookupExample.output,
    });
  });

  it("classifies sub-zero but above minus eighteen as frozen and positive as chilled", () => {
    const frozen = runReeferSetpointTempModeLookup({ setpointTempC: -5 });
    const chilled = runReeferSetpointTempModeLookup({ setpointTempC: 4.4 });
    if (!frozen.ok || !chilled.ok) throw new Error("expected success");
    expect(frozen.output.transportMode).toBe("frozen");
    expect(chilled.output.transportMode).toBe("chilled");
  });
  it("rejects inverted thresholds", () => {
    expect(
      runReeferSetpointTempModeLookup({
        setpointTempC: -10,
        deepFrozenMaximumC: -5,
        frozenMaximumC: -20,
      }).ok,
    ).toBe(false);
  });

  it("rejects non-finite thresholds", () => {
    expect(
      runReeferSetpointTempModeLookup({
        deepFrozenMaximumC: Number.NEGATIVE_INFINITY,
        setpointTempC: -10,
      }).ok,
    ).toBe(false);
  });
});
