import { describe, expect, it } from "vitest";
import {
  faradayInducedVoltageExample,
  runFaradayInducedVoltage,
} from "./tool.js";
describe("Faraday Induced EMF", () => {
  it("publishes an executable example", () =>
    expect(
      runFaradayInducedVoltage(faradayInducedVoltageExample.input),
    ).toEqual({ ok: true, output: faradayInducedVoltageExample.output }));
  it("negates rising flux for a positive-going emf", () =>
    expect(
      runFaradayInducedVoltage({ turnsInt: 10, dFluxDtWbPerSecond: 0.5 }),
    ).toEqual({ ok: true, output: { inducedEmfVolts: -5 } }));
  it("rejects zero turns", () =>
    expect(
      runFaradayInducedVoltage({ turnsInt: 0, dFluxDtWbPerSecond: 1 }).ok,
    ).toBe(false));
  it("rejects fractional turns", () =>
    expect(
      runFaradayInducedVoltage({ turnsInt: 1.5, dFluxDtWbPerSecond: 1 }).ok,
    ).toBe(false));
});
