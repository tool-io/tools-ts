import { describe, expect, it } from "vitest";
import {
  relativeWaterContentExample,
  runRelativeWaterContent,
} from "./tool.js";

describe("RWC Percent", () => {
  it("publishes an executable example", () =>
    expect(runRelativeWaterContent(relativeWaterContentExample.input)).toEqual({
      ok: true,
      output: relativeWaterContentExample.output,
    }));
  it("returns zero when fresh mass equals dry mass", () =>
    expect(
      runRelativeWaterContent({ dryMassG: 4, freshMassG: 4, turgidMassG: 10 }),
    ).toEqual({ ok: true, output: { relativeWaterContentPercent: 0 } }));
  it("returns one hundred percent at full turgor", () =>
    expect(
      runRelativeWaterContent({ dryMassG: 4, freshMassG: 10, turgidMassG: 10 }),
    ).toEqual({ ok: true, output: { relativeWaterContentPercent: 100 } }));
  it("supports fractional hydration", () => {
    const result = runRelativeWaterContent({
      dryMassG: 0,
      freshMassG: 1,
      turgidMassG: 3,
    });
    expect(result.ok).toBe(true);
    if (result.ok)
      expect(result.output.relativeWaterContentPercent).toBeCloseTo(
        33.33333333333333,
        12,
      );
  });
  it("rejects equal turgid and dry masses", () => {
    const result = runRelativeWaterContent({
      dryMassG: 5,
      freshMassG: 5,
      turgidMassG: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("equal_masses");
  });
  it("rejects a turgid mass below the dry mass", () => {
    const result = runRelativeWaterContent({
      dryMassG: 6,
      freshMassG: 3,
      turgidMassG: 5,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("equal_masses");
  });
  it("rejects a fresh mass below the dry mass", () => {
    const result = runRelativeWaterContent({
      dryMassG: 5,
      freshMassG: 4,
      turgidMassG: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_masses");
  });
  it("rejects a fresh mass above the turgid mass", () => {
    const result = runRelativeWaterContent({
      dryMassG: 4,
      freshMassG: 11,
      turgidMassG: 10,
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.issues[0].code).toBe("invalid_masses");
  });
});
