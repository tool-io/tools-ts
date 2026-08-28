import { describe, expect, it } from "vitest";
import { runVoltsToDbv } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runVoltsToDbv>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runVoltsToDbv>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Volts To dBV", () => {
  it("maps 1 V to 0 dBV", () =>
    expect(runVoltsToDbv({ voltsRms: 1 })).toEqual({
      ok: true,
      output: { dbv: 0 },
    }));
  it("maps 10 V to +20 dBV", () =>
    expect(output(runVoltsToDbv({ voltsRms: 10 })).dbv).toBeCloseTo(20, 9));
  it("maps 0.1 V to -20 dBV", () =>
    expect(output(runVoltsToDbv({ voltsRms: 0.1 })).dbv).toBeCloseTo(-20, 9));
  it("maps 1 mV to -60 dBV", () =>
    expect(output(runVoltsToDbv({ voltsRms: 0.001 })).dbv).toBeCloseTo(-60, 9));
  it("maps 100 V to +40 dBV", () =>
    expect(output(runVoltsToDbv({ voltsRms: 100 })).dbv).toBeCloseTo(40, 9));
  it("rejects a zero voltage", () => {
    const result = runVoltsToDbv({ voltsRms: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative voltage", () =>
    expect(runVoltsToDbv({ voltsRms: -1 }).ok).toBe(false));
});
