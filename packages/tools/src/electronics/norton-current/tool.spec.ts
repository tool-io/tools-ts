import { describe, expect, it } from "vitest";
import { runNortonCurrent } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runNortonCurrent>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runNortonCurrent>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Norton Current", () => {
  it("computes the Norton source current in amperes", () =>
    expect(
      runNortonCurrent({ theveninResistanceOhms: 50, theveninVoltage: 10 }),
    ).toEqual({ ok: true, output: { nortonCurrentAmps: 0.2 } }));
  it("computes the Norton current for a small source", () =>
    expect(
      output(
        runNortonCurrent({ theveninResistanceOhms: 100, theveninVoltage: 1 }),
      ).nortonCurrentAmps,
    ).toBeCloseTo(0.01, 12));
  it("computes the Norton current for a stiff source", () =>
    expect(
      output(
        runNortonCurrent({ theveninResistanceOhms: 250, theveninVoltage: 5 }),
      ).nortonCurrentAmps,
    ).toBeCloseTo(0.02, 12));
  it("rejects a zero Thevenin voltage", () => {
    const result = runNortonCurrent({
      theveninResistanceOhms: 50,
      theveninVoltage: 0,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative Thevenin voltage", () =>
    expect(
      runNortonCurrent({ theveninResistanceOhms: 50, theveninVoltage: -10 }).ok,
    ).toBe(false));
  it("rejects a zero Thevenin resistance", () => {
    const result = runNortonCurrent({
      theveninResistanceOhms: 0,
      theveninVoltage: 10,
    });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative Thevenin resistance", () =>
    expect(
      runNortonCurrent({ theveninResistanceOhms: -50, theveninVoltage: 10 }).ok,
    ).toBe(false));
});
