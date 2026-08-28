import { describe, expect, it } from "vitest";
import { runTransistorBaseResistor } from "./tool.js";

const firstIssueCode = (
  result: ReturnType<typeof runTransistorBaseResistor>,
) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runTransistorBaseResistor>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Base Resistor Value", () => {
  it("computes the base resistor using the default 0.7V Vbe", () =>
    expect(
      output(runTransistorBaseResistor({ baseCurrentMa: 0.1, controlVolts: 5 }))
        .baseResistorOhms,
    ).toBeCloseTo(43000, 6));
  it("computes the base resistor with an explicit Vbe", () =>
    expect(
      output(
        runTransistorBaseResistor({
          baseCurrentMa: 0.05,
          baseEmitterVolts: 0.7,
          controlVolts: 3.3,
        }),
      ).baseResistorOhms,
    ).toBeCloseTo(52000, 6));
  it("computes the base resistor for a germanium-like 0.6V Vbe", () =>
    expect(
      output(
        runTransistorBaseResistor({
          baseCurrentMa: 0.02,
          baseEmitterVolts: 0.6,
          controlVolts: 3.3,
        }),
      ).baseResistorOhms,
    ).toBeCloseTo(135000, 6));
  it("reports insufficient drive when control equals the default Vbe", () => {
    const result = runTransistorBaseResistor({
      baseCurrentMa: 0.1,
      controlVolts: 0.7,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("insufficient_drive");
  });
  it("reports insufficient drive when control is below Vbe", () => {
    const result = runTransistorBaseResistor({
      baseCurrentMa: 0.1,
      baseEmitterVolts: 2,
      controlVolts: 1,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("insufficient_drive");
  });
  it("rejects a zero base current", () => {
    const result = runTransistorBaseResistor({
      baseCurrentMa: 0,
      controlVolts: 5,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative base current", () =>
    expect(
      runTransistorBaseResistor({ baseCurrentMa: -0.1, controlVolts: 5 }).ok,
    ).toBe(false));
});
