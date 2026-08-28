import { describe, expect, it } from "vitest";
import { runLedCurrent } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runLedCurrent>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runLedCurrent>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("LED Current Resistor", () => {
  it("computes the LED current in milliamps", () =>
    expect(
      runLedCurrent({ forwardVolts: 2, resistorOhms: 150, supplyVolts: 5 }),
    ).toEqual({ ok: true, output: { ledCurrentMa: 20 } }));
  it("computes the current for a 3.2V LED on a 9V supply", () =>
    expect(
      output(
        runLedCurrent({ forwardVolts: 3.2, resistorOhms: 330, supplyVolts: 9 }),
      ).ledCurrentMa,
    ).toBeCloseTo(17.575757575757574, 9));
  it("computes the current for an indicator LED on 3.3V", () =>
    expect(
      output(
        runLedCurrent({
          forwardVolts: 1.8,
          resistorOhms: 100,
          supplyVolts: 3.3,
        }),
      ).ledCurrentMa,
    ).toBeCloseTo(15, 9));
  it("reports reverse bias when supply equals forward voltage", () => {
    const result = runLedCurrent({
      forwardVolts: 5,
      resistorOhms: 150,
      supplyVolts: 5,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("reverse_bias");
  });
  it("reports reverse bias when supply is below forward voltage", () => {
    const result = runLedCurrent({
      forwardVolts: 3,
      resistorOhms: 150,
      supplyVolts: 2,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("reverse_bias");
  });
  it("rejects a zero resistor", () => {
    const result = runLedCurrent({
      forwardVolts: 2,
      resistorOhms: 0,
      supplyVolts: 5,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative resistor", () =>
    expect(
      runLedCurrent({ forwardVolts: 2, resistorOhms: -150, supplyVolts: 5 }).ok,
    ).toBe(false));
});
