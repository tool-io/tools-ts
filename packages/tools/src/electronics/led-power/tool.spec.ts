import { describe, expect, it } from "vitest";
import { runLedPower } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runLedPower>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runLedPower>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("LED Power Dissipation", () => {
  it("computes the power dissipated by a standard LED", () =>
    expect(runLedPower({ currentAmps: 0.02, forwardVolts: 2 })).toEqual({
      ok: true,
      output: { ledPowerWatts: 0.04 },
    }));
  it("computes the power for a small indicator LED", () =>
    expect(
      output(runLedPower({ currentAmps: 0.005, forwardVolts: 1.8 }))
        .ledPowerWatts,
    ).toBeCloseTo(0.009, 12));
  it("computes the power for a high-power LED", () =>
    expect(
      output(runLedPower({ currentAmps: 0.35, forwardVolts: 3.3 }))
        .ledPowerWatts,
    ).toBeCloseTo(1.155, 12));
  it("rejects a zero forward voltage", () => {
    const result = runLedPower({ currentAmps: 0.02, forwardVolts: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative forward voltage", () =>
    expect(runLedPower({ currentAmps: 0.02, forwardVolts: -2 }).ok).toBe(
      false,
    ));
  it("rejects a zero current", () => {
    const result = runLedPower({ currentAmps: 0, forwardVolts: 2 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative current", () =>
    expect(runLedPower({ currentAmps: -0.02, forwardVolts: 2 }).ok).toBe(
      false,
    ));
});
