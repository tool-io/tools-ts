import { describe, expect, it } from "vitest";
import {
  otifOnTimeInFullPercentExample,
  runOtifOnTimeInFullPercent,
} from "./tool.js";

describe("otif-on-time-in-full-percent", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runOtifOnTimeInFullPercent(otifOnTimeInFullPercentExample.input),
    ).toEqual({
      ok: true,
      output: otifOnTimeInFullPercentExample.output,
    });
  });

  it("handles fractional percentages", () => {
    expect(
      runOtifOnTimeInFullPercent({
        ordersDelivered: 3000,
        ordersOnTimeInFull: 2941,
      }),
    ).toEqual({ ok: true, output: { otifPercent: 98.03333333333333 } });
  });

  it("rejects zero delivered orders", () => {
    expect(
      runOtifOnTimeInFullPercent({ ordersDelivered: 0, ordersOnTimeInFull: 0 })
        .ok,
    ).toBe(false);
  });

  it("rejects an OTIF count larger than total deliveries", () => {
    expect(
      runOtifOnTimeInFullPercent({
        ordersDelivered: 100,
        ordersOnTimeInFull: 101,
      }).ok,
    ).toBe(false);
  });
});
