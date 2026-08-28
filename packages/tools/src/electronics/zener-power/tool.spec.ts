import { describe, expect, it } from "vitest";
import { runZenerPower } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runZenerPower>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runZenerPower>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Zener Power Dissipation", () => {
  it("computes the power dissipated by a 5V Zener at 10mA", () =>
    expect(runZenerPower({ zenerCurrentAmps: 0.01, zenerVolts: 5 })).toEqual({
      ok: true,
      output: { zenerPowerWatts: 0.05 },
    }));
  it("computes the power for a 12V Zener at 5mA", () =>
    expect(
      output(runZenerPower({ zenerCurrentAmps: 0.005, zenerVolts: 12 }))
        .zenerPowerWatts,
    ).toBeCloseTo(0.06, 12));
  it("computes the power for a 3.3V Zener at 20mA", () =>
    expect(
      output(runZenerPower({ zenerCurrentAmps: 0.02, zenerVolts: 3.3 }))
        .zenerPowerWatts,
    ).toBeCloseTo(0.066, 12));
  it("rejects a zero Zener voltage", () => {
    const result = runZenerPower({ zenerCurrentAmps: 0.01, zenerVolts: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative Zener voltage", () =>
    expect(runZenerPower({ zenerCurrentAmps: 0.01, zenerVolts: -5 }).ok).toBe(
      false,
    ));
  it("rejects a zero Zener current", () => {
    const result = runZenerPower({ zenerCurrentAmps: 0, zenerVolts: 5 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative Zener current", () =>
    expect(runZenerPower({ zenerCurrentAmps: -0.01, zenerVolts: 5 }).ok).toBe(
      false,
    ));
});
