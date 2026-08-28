import { describe, expect, it } from "vitest";
import { phantomPowerCurrentExample, runPhantomPowerCurrent } from "./tool.js";

const outputOf = (input: {
  feedResistorEachOhms: number;
  phantomVolts: number;
}) => {
  const result = runPhantomPowerCurrent(input);
  if (!result.ok) throw new Error("expected success");
  return result.output as { phantomCurrentMa: number };
};

describe("Phantom Current Per Mic", () => {
  it("reproduces the canonical P48 example", () =>
    expect(runPhantomPowerCurrent(phantomPowerCurrentExample.input)).toEqual({
      ok: true,
      output: { phantomCurrentMa: 3.5294117647058827 },
    }));

  it("divides by twice the single-resistor value", () => {
    const { phantomCurrentMa } = outputOf({
      feedResistorEachOhms: 4700,
      phantomVolts: 24,
    });
    expect(phantomCurrentMa).toBeCloseTo((24 / (4700 * 2)) * 1000, 9);
  });

  it("yields about 3.53 milliamps for standard P48 wiring", () =>
    expect(
      outputOf({ feedResistorEachOhms: 6800, phantomVolts: 48 })
        .phantomCurrentMa,
    ).toBeCloseTo(3.53, 2));

  it("doubles current when supply voltage doubles", () => {
    const low = outputOf({
      feedResistorEachOhms: 6800,
      phantomVolts: 24,
    }).phantomCurrentMa;
    const high = outputOf({
      feedResistorEachOhms: 6800,
      phantomVolts: 48,
    }).phantomCurrentMa;
    expect(high).toBeCloseTo(low * 2, 12);
  });

  it("halves current when each feed resistor doubles", () => {
    const base = outputOf({
      feedResistorEachOhms: 3400,
      phantomVolts: 48,
    }).phantomCurrentMa;
    const bigger = outputOf({
      feedResistorEachOhms: 6800,
      phantomVolts: 48,
    }).phantomCurrentMa;
    expect(bigger).toBeCloseTo(base / 2, 12);
  });

  it("supports P12 and P24 standards", () => {
    expect(
      outputOf({ feedResistorEachOhms: 680, phantomVolts: 12 })
        .phantomCurrentMa,
    ).toBeCloseTo(8.82, 2);
    expect(
      outputOf({ feedResistorEachOhms: 1200, phantomVolts: 24 })
        .phantomCurrentMa,
    ).toBeCloseTo(10, 9);
  });

  it("rejects non-positive voltage or resistance", () => {
    expect(
      runPhantomPowerCurrent({ feedResistorEachOhms: 6800, phantomVolts: 0 })
        .ok,
    ).toBe(false);
    expect(
      runPhantomPowerCurrent({ feedResistorEachOhms: 0, phantomVolts: 48 }).ok,
    ).toBe(false);
    expect(
      runPhantomPowerCurrent({ feedResistorEachOhms: -6800, phantomVolts: 48 })
        .ok,
    ).toBe(false);
  });
});
