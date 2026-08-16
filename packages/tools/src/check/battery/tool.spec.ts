import { describe, expect, it } from "vitest";
import { validateToolContract } from "../../core/contract.js";
import {
  batteryCheckExample,
  batteryCheckTool,
  calculateBatteryCheck,
} from "./tool.js";

const issueCodes = (result: ReturnType<typeof calculateBatteryCheck>) =>
  result.ok ? [] : result.error.issues.map((issue) => issue.code);

describe("Battery Checker", () => {
  it("executes the canonical example to its exact declared output", () => {
    const result = batteryCheckTool.execute(batteryCheckExample.input);
    expect(result).toEqual({ ok: true, output: batteryCheckExample.output });
  });

  it("publishes a valid pure tool contract", () => {
    expect(batteryCheckTool.id).toBe("check/battery");
    expect(validateToolContract(batteryCheckTool)).toEqual([]);
  });

  it("classifies charge bands while discharging", () => {
    for (const [level, health] of [
      [85, "good"],
      [50, "fair"],
      [15, "low"],
    ] as const) {
      const result = calculateBatteryCheck({
        charging: false,
        levelPercent: level,
      });
      expect(result.ok).toBe(true);
      if (result.ok)
        expect(result.output.health).toBe(health);
    }
  });

  it("warns on low and critical charge only when unplugged", () => {
    const low = calculateBatteryCheck({ charging: false, levelPercent: 15 });
    expect(low.ok).toBe(true);
    if (low.ok) expect(low.output.issues).toEqual(["low-battery"]);
    const critical = calculateBatteryCheck({
      charging: false,
      levelPercent: 5,
    });
    expect(critical.ok).toBe(true);
    if (critical.ok)
      expect(critical.output.issues).toEqual([
        "low-battery",
        "critical-battery",
      ]);
    const chargingLow = calculateBatteryCheck({
      charging: true,
      levelPercent: 5,
    });
    expect(chargingLow.ok).toBe(true);
    if (chargingLow.ok) {
      expect(chargingLow.output.health).toBe("charging");
      expect(chargingLow.output.issues).toEqual([]);
    }
  });

  it("reports unknown health without a level", () => {
    const result = calculateBatteryCheck({ charging: false });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.health).toBe("unknown");
      expect(result.output.issues).toEqual(["level-unreported"]);
    }
  });

  it("converts second estimates into hour estimates", () => {
    const result = calculateBatteryCheck({
      chargeTimeSeconds: 4500,
      charging: true,
      dischargeTimeSeconds: 7200,
      levelPercent: 40,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.output.chargeTimeHours).toBe(1.25);
      expect(result.output.dischargeTimeHours).toBe(2);
    }
  });

  it("rejects malformed probes", () => {
    expect(calculateBatteryCheck(null).ok).toBe(false);
    expect(
      issueCodes(calculateBatteryCheck({ levelPercent: 101 })),
    ).toEqual(["level_percent_invalid"]);
    expect(
      issueCodes(calculateBatteryCheck({ levelPercent: -1 })),
    ).toEqual(["level_percent_invalid"]);
    expect(issueCodes(calculateBatteryCheck({ charging: 1 }))).toEqual([
      "charging_invalid",
    ]);
    expect(
      issueCodes(calculateBatteryCheck({ dischargeTimeSeconds: -60 })),
    ).toEqual(["discharge_time_invalid"]);
    expect(issueCodes(calculateBatteryCheck({ extra: true }))).toEqual([
      "unknown_field",
    ]);
  });
});
