import { describe, expect, it } from "vitest";
import {
  relativeWaterContent2Example,
  runRelativeWaterContent2,
} from "./tool.js";

describe("RWC Dewpoint Variant", () => {
  it("publishes an executable example", () =>
    expect(
      runRelativeWaterContent2(relativeWaterContent2Example.input),
    ).toEqual({
      ok: true,
      output: relativeWaterContent2Example.output,
    }));
  it("returns zero at the dry mass", () =>
    expect(
      runRelativeWaterContent2({
        dryMassG: 4,
        freshMassG: 4,
        turgidMassG: 10,
      }),
    ).toEqual({ ok: true, output: { relativeWaterContentVariantPercent: 0 } }));
  it("returns one hundred at the turgid mass", () =>
    expect(
      runRelativeWaterContent2({
        dryMassG: 4,
        freshMassG: 10,
        turgidMassG: 10,
      }),
    ).toEqual({
      ok: true,
      output: { relativeWaterContentVariantPercent: 100 },
    }));
  it("rejects turgid mass equal to dry mass", () => {
    const result = runRelativeWaterContent2({
      dryMassG: 5,
      freshMassG: 5,
      turgidMassG: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("equal_masses");
  });
  it("rejects fresh mass outside the dry and turgid range", () => {
    const result = runRelativeWaterContent2({
      dryMassG: 4,
      freshMassG: 12,
      turgidMassG: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_masses");
  });
});
