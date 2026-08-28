import { describe, expect, it } from "vitest";
import { runVoltsToDbu } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runVoltsToDbu>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runVoltsToDbu>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Volts To dBu", () => {
  it("maps the 0.7746 V reference to 0 dBu", () =>
    expect(runVoltsToDbu({ voltsRms: 0.7746 })).toEqual({
      ok: true,
      output: { dbu: 0 },
    }));
  it("maps 7.746 V to +20 dBu", () =>
    expect(output(runVoltsToDbu({ voltsRms: 7.746 })).dbu).toBeCloseTo(20, 9));
  it("maps 0.07746 V to -20 dBu", () =>
    expect(output(runVoltsToDbu({ voltsRms: 0.07746 })).dbu).toBeCloseTo(
      -20,
      9,
    ));
  it("maps 0.007746 V to -40 dBu", () =>
    expect(output(runVoltsToDbu({ voltsRms: 0.007746 })).dbu).toBeCloseTo(
      -40,
      9,
    ));
  it("maps 77.46 V to +40 dBu", () =>
    expect(output(runVoltsToDbu({ voltsRms: 77.46 })).dbu).toBeCloseTo(40, 9));
  it("rejects a zero voltage", () => {
    const result = runVoltsToDbu({ voltsRms: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative voltage", () =>
    expect(runVoltsToDbu({ voltsRms: -0.7746 }).ok).toBe(false));
});
