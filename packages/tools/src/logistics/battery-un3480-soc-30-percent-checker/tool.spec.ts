import { describe, expect, it } from "vitest";
import {
  calculateBatteryUn3480Soc30PercentChecker,
  batteryUn3480Soc30PercentCheckerExample,
  runBatteryUn3480Soc30PercentChecker,
} from "./tool.js";

describe("logistics/battery-un3480-soc-30-percent-checker", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runBatteryUn3480Soc30PercentChecker(
        batteryUn3480Soc30PercentCheckerExample.input,
      ),
    ).toEqual({
      ok: true,
      output: batteryUn3480Soc30PercentCheckerExample.output,
    });
  });

  it("fails an over-limit charge with negative margin", () => {
    const result = runBatteryUn3480Soc30PercentChecker({
      stateOfChargePercent: 55,
    });
    if (!result.ok) throw new Error("expected success");
    expect(result.output.compliant).toBe(false);
    expect(result.output.marginToLimitPercent as number).toBe(-25);
  });

  it("rejects charges above 100 percent via schema validation", () => {
    expect(
      runBatteryUn3480Soc30PercentChecker({ stateOfChargePercent: 101 }).ok,
    ).toBe(false);
  });

  it("rejects non-finite direct input", () => {
    expect(() =>
      calculateBatteryUn3480Soc30PercentChecker({
        stateOfChargePercent: Number.NaN,
      }),
    ).toThrow("between zero and one hundred");
  });
});
