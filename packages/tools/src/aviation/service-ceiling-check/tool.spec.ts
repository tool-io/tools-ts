import { describe, expect, it } from "vitest";
import { runServiceCeilingCheck, serviceCeilingCheckExample } from "./tool.js";

describe("service ceiling checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runServiceCeilingCheck(serviceCeilingCheckExample.input)).toEqual({
      ok: true,
      output: serviceCeilingCheckExample.output,
    });
  });

  it("flags exceedances with negative margin", () => {
    expect(
      runServiceCeilingCheck({
        plannedAltitudeFt: 15000,
        serviceCeilingFt: 12500,
      }),
    ).toEqual({
      ok: true,
      output: { marginFt: -2500, withinServiceCeiling: false },
    });
  });

  it("rejects negative planned altitude through execution", () => {
    expect(
      runServiceCeilingCheck({
        plannedAltitudeFt: -100,
        serviceCeilingFt: 12500,
      }).ok,
    ).toBe(false);
  });
});
