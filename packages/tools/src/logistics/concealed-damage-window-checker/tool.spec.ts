import { describe, expect, it } from "vitest";
import {
  calculateConcealedDamageWindowChecker,
  concealedDamageWindowCheckerExample,
  runConcealedDamageWindowChecker,
} from "./tool.js";

describe("concealed-damage-window-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runConcealedDamageWindowChecker(
        concealedDamageWindowCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: concealedDamageWindowCheckerExample.output,
    });
  });

  it("closes the window after day five by default", () => {
    expect(runConcealedDamageWindowChecker({ daysSinceDelivery: 6 })).toEqual({
      ok: true,
      output: { daysLeftToReport: -1, withinReportingWindow: false },
    });
  });

  it("supports a same-day-only reporting window", () => {
    expect(
      runConcealedDamageWindowChecker({
        concealedDamageWindowDays: 0,
        daysSinceDelivery: 1,
      }),
    ).toEqual({
      ok: true,
      output: { daysLeftToReport: -1, withinReportingWindow: false },
    });
  });

  it("rejects non-finite elapsed days", () => {
    expect(() =>
      calculateConcealedDamageWindowChecker({
        daysSinceDelivery: Number.POSITIVE_INFINITY,
      }),
    ).toThrow("must be finite");
  });
});
