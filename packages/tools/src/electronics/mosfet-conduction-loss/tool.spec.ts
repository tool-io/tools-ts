import { describe, expect, it } from "vitest";
import {
  mosfetConductionLossExample,
  runMosfetConductionLoss,
} from "./tool.js";

describe("Conduction Loss", () => {
  it("reproduces its canonical example exactly", () =>
    expect(runMosfetConductionLoss(mosfetConductionLossExample.input)).toEqual({
      ok: true,
      output: mosfetConductionLossExample.output,
    }));

  it("computes I squared times R for a two amp load", () =>
    expect(
      runMosfetConductionLoss({ drainCurrentRmsA: 2, rdsonOhms: 0.05 }),
    ).toEqual({ ok: true, output: { conductionLossWatts: 0.2 } }));

  it("quadruples the loss when the current doubles", () => {
    const base = runMosfetConductionLoss({
      drainCurrentRmsA: 2,
      rdsonOhms: 0.02,
    });
    const doubled = runMosfetConductionLoss({
      drainCurrentRmsA: 4,
      rdsonOhms: 0.02,
    });
    if (!base.ok || !doubled.ok) throw new Error("expected success");
    expect(doubled.output.conductionLossWatts).toBeCloseTo(
      Number(base.output.conductionLossWatts) * 4,
      12,
    );
  });

  it("scales linearly with RDS(on)", () => {
    const low = runMosfetConductionLoss({
      drainCurrentRmsA: 5,
      rdsonOhms: 0.01,
    });
    const high = runMosfetConductionLoss({
      drainCurrentRmsA: 5,
      rdsonOhms: 0.03,
    });
    if (!low.ok || !high.ok) throw new Error("expected success");
    expect(high.output.conductionLossWatts).toBeCloseTo(
      Number(low.output.conductionLossWatts) * 3,
      12,
    );
  });

  it("rejects a non-positive RMS current", () =>
    expect(
      runMosfetConductionLoss({ drainCurrentRmsA: 0, rdsonOhms: 0.01 }),
    ).toMatchObject({
      error: {
        issues: [{ code: "invalid_current", field: "drainCurrentRmsA" }],
      },
      ok: false,
    }));

  it("rejects a non-positive RDS(on)", () =>
    expect(
      runMosfetConductionLoss({ drainCurrentRmsA: 3, rdsonOhms: -0.01 }),
    ).toMatchObject({
      error: { issues: [{ code: "invalid_resistance", field: "rdsonOhms" }] },
      ok: false,
    }));

  it("rejects missing required inputs", () =>
    expect(runMosfetConductionLoss(undefined as never)).toMatchObject({
      error: { code: "invalid_input" },
      ok: false,
    }));
});
