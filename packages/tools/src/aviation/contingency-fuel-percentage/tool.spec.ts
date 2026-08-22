import { describe, expect, it } from "vitest";
import {
  contingencyFuelPercentageExample,
  runContingencyFuelPercentage,
} from "./tool.js";

describe("contingency fuel percentage calculator", () => {
  it("reproduces its canonical example exactly", () => {
    expect(
      runContingencyFuelPercentage(contingencyFuelPercentageExample.input),
    ).toEqual({
      ok: true,
      output: contingencyFuelPercentageExample.output,
    });
  });

  it("defaults to five percent of trip fuel", () => {
    expect(runContingencyFuelPercentage({ tripFuelKg: 8000 })).toEqual({
      ok: true,
      output: { contingencyFuelKg: 400 },
    });
  });

  it("allows a zero percent contingency", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: 0,
        tripFuelKg: 8000,
      }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 0 } });
  });

  it("accepts the twenty percent ceiling", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: 20,
        tripFuelKg: 5000,
      }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 1000 } });
  });

  it("rejects percentages above twenty", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: 25,
        tripFuelKg: 5000,
      }).ok,
    ).toBe(false);
  });

  it("rejects negative percentages", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: -1,
        tripFuelKg: 5000,
      }).ok,
    ).toBe(false);
  });

  it("rejects zero trip fuel", () => {
    expect(
      runContingencyFuelPercentage({ contingencyPercent: 5, tripFuelKg: 0 }).ok,
    ).toBe(false);
  });

  it("rejects negative trip fuel", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: 5,
        tripFuelKg: -100,
      }).ok,
    ).toBe(false);
  });

  it("produces exact fractional allowances", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: 7,
        tripFuelKg: 3333,
      }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 233.31 } });
  });

  it("computes a realistic airline allowance", () => {
    expect(
      runContingencyFuelPercentage({
        contingencyPercent: 5,
        tripFuelKg: 12400,
      }),
    ).toEqual({ ok: true, output: { contingencyFuelKg: 620 } });
  });
});
