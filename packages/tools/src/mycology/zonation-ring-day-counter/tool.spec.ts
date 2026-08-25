import { describe, expect, it } from "vitest";
import {
  runZonationRingDayCounter,
  zonationRingDayCounterExample,
} from "./tool.js";

describe("Zonation Day Counter", () => {
  it("matches the canonical example", () => {
    expect(
      runZonationRingDayCounter(zonationRingDayCounterExample.input),
    ).toEqual({
      ok: true,
      output: zonationRingDayCounterExample.output,
    });
  });
  it("requires a measured days-per-ring interval", () =>
    expect(runZonationRingDayCounter({ ringCountInt: 12 }).ok).toBe(false));
  it("multiplies by a custom days-per-ring", () =>
    expect(
      runZonationRingDayCounter({ daysPerRing: 2.5, ringCountInt: 4 }),
    ).toEqual({ ok: true, output: { estimatedZoneDays: 10 } }));
  it("handles zero rings", () =>
    expect(
      runZonationRingDayCounter({ daysPerRing: 1, ringCountInt: 0 }),
    ).toEqual({
      ok: true,
      output: { estimatedZoneDays: 0 },
    }));
  it("rejects negative ring counts", () =>
    expect(
      runZonationRingDayCounter({ daysPerRing: 1, ringCountInt: -1 }).ok,
    ).toBe(false));
  it("rejects zero days per ring", () =>
    expect(
      runZonationRingDayCounter({ daysPerRing: 0, ringCountInt: 3 }).ok,
    ).toBe(false));
  it("rejects negative days per ring", () =>
    expect(
      runZonationRingDayCounter({ daysPerRing: -2, ringCountInt: 3 }).ok,
    ).toBe(false));
  it("rejects fractional ring counts", () =>
    expect(
      runZonationRingDayCounter({ daysPerRing: 1, ringCountInt: 1.5 }).ok,
    ).toBe(false));
});
