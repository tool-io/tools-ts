import { describe, expect, it } from "vitest";
import { runCellConcentration } from "./tool.js";

describe("Cell Concentration From Dilution", () => {
  it("calculates a valid result", () =>
    expect(
      runCellConcentration({
        countedConcentration: 250000,
        dilutionFactor: 4,
      }),
    ).toEqual({ ok: true, output: { originalConcentration: 1000000 } }));
  it("passes undiluted samples through", () =>
    expect(
      runCellConcentration({
        countedConcentration: 125000,
        dilutionFactor: 1,
      }),
    ).toEqual({ ok: true, output: { originalConcentration: 125000 } }));
  it("handles fractional dilution factors", () =>
    expect(
      runCellConcentration({
        countedConcentration: 20000,
        dilutionFactor: 2.5,
      }),
    ).toEqual({ ok: true, output: { originalConcentration: 50000 } }));
  it("allows a zero counted concentration", () =>
    expect(
      runCellConcentration({
        countedConcentration: 0,
        dilutionFactor: 10,
      }),
    ).toEqual({ ok: true, output: { originalConcentration: 0 } }));
  it("scales very large counts", () =>
    expect(
      runCellConcentration({
        countedConcentration: 1500000,
        dilutionFactor: 10,
      }),
    ).toEqual({ ok: true, output: { originalConcentration: 15000000 } }));
  it("rejects dilution factors below one", () =>
    expect(
      runCellConcentration({
        countedConcentration: 100000,
        dilutionFactor: 0.5,
      }).ok,
    ).toBe(false));
  it("rejects negative counted concentrations", () =>
    expect(
      runCellConcentration({ countedConcentration: -1, dilutionFactor: 2 }).ok,
    ).toBe(false));
});
