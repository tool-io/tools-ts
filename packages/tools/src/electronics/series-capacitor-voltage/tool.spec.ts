import { describe, expect, it } from "vitest";
import {
  runSeriesCapacitorVoltage,
  seriesCapacitorVoltageExample,
} from "./tool.js";
describe("Series Cap Voltage Divider", () => {
  it("publishes an executable example", () =>
    expect(
      runSeriesCapacitorVoltage(seriesCapacitorVoltageExample.input),
    ).toEqual({ ok: true, output: seriesCapacitorVoltageExample.output }));
  it("splits equal capacitors evenly", () =>
    expect(
      runSeriesCapacitorVoltage({ supplyVolts: 9, c1: 4e-6, c2: 4e-6 }),
    ).toEqual({ ok: true, output: { voltageAcrossC1V: 4.5 } }));
  it("rejects zero C1", () =>
    expect(
      runSeriesCapacitorVoltage({ supplyVolts: 9, c1: 0, c2: 4e-6 }).ok,
    ).toBe(false));
  it("rejects zero C2", () =>
    expect(
      runSeriesCapacitorVoltage({ supplyVolts: 9, c1: 4e-6, c2: 0 }).ok,
    ).toBe(false));
});
