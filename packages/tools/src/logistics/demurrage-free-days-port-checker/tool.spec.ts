import { describe, expect, it } from "vitest";
import {
  calculateDemurrageFreeDaysPortChecker,
  demurrageFreeDaysPortCheckerExample,
  runDemurrageFreeDaysPortChecker,
} from "./tool.js";

describe("logistics/demurrage-free-days-port-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runDemurrageFreeDaysPortChecker(
        demurrageFreeDaysPortCheckerExample.input,
      ),
    ).toEqual({ ok: true, output: demurrageFreeDaysPortCheckerExample.output });
  });

  it("stays inside the free window when picked up on the last free day", () => {
    const result = runDemurrageFreeDaysPortChecker({
      dischargeDate: "2026-03-02",
      freeDays: 5,
      pickupDate: "2026-03-06",
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.chargeableDays as number).toBe(0);
    expect(result.output.withinFreeWindow).toBe(true);
  });

  it("rejects a pickup before discharge", () => {
    expect(
      runDemurrageFreeDaysPortChecker({
        dischargeDate: "2026-03-02",
        pickupDate: "2026-03-01",
      }).ok,
    ).toBe(false);
  });

  it("rejects impossible dates and non-positive free-day counts", () => {
    expect(() =>
      calculateDemurrageFreeDaysPortChecker({
        dischargeDate: "2026-02-30",
        pickupDate: "2026-03-01",
      }),
    ).toThrow("real calendar date");
    expect(
      runDemurrageFreeDaysPortChecker({
        dischargeDate: "2026-03-02",
        freeDays: 0,
        pickupDate: "2026-03-02",
      }).ok,
    ).toBe(false);
  });
});
