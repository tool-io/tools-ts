import { describe, expect, it } from "vitest";
import { runTheveninResistance } from "./tool.js";

const firstIssueCode = (result: ReturnType<typeof runTheveninResistance>) => {
  if (result.ok) throw new Error("expected failure");
  return result.error.issues[0]?.code;
};
const output = (result: ReturnType<typeof runTheveninResistance>) => {
  if (!result.ok) throw new Error("expected success");
  return result.output;
};

describe("Thevenin Resistance", () => {
  it("computes the Thevenin resistance of a divider", () =>
    expect(
      output(runTheveninResistance({ r1Ohms: 1000, r2Ohms: 2000 }))
        .theveninResistanceOhms,
    ).toBeCloseTo(666.6666666666666, 9));
  it("computes half the resistance for an equal divider", () =>
    expect(runTheveninResistance({ r1Ohms: 10000, r2Ohms: 10000 })).toEqual({
      ok: true,
      output: { theveninResistanceOhms: 5000 },
    }));
  it("computes the Thevenin resistance for unequal resistors", () =>
    expect(
      output(runTheveninResistance({ r1Ohms: 470, r2Ohms: 330 }))
        .theveninResistanceOhms,
    ).toBeCloseTo(193.875, 9));
  it("rejects a zero R1", () => {
    const result = runTheveninResistance({ r1Ohms: 0, r2Ohms: 2000 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a zero R2", () => {
    const result = runTheveninResistance({ r1Ohms: 1000, r2Ohms: 0 });
    expect(result.ok).toBe(false);
    expect(firstIssueCode(result)).toBe("invalid_value");
  });
  it("rejects a negative R1", () =>
    expect(runTheveninResistance({ r1Ohms: -1000, r2Ohms: 2000 }).ok).toBe(
      false,
    ));
  it("rejects a negative R2", () =>
    expect(runTheveninResistance({ r1Ohms: 1000, r2Ohms: -2000 }).ok).toBe(
      false,
    ));
});
