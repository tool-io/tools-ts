import { describe, expect, it } from "vitest";
import { diodeConductionLossExample, runDiodeConductionLoss } from "./tool.js";
describe("Diode Conduction Loss", () => {
  it("reproduces its canonical example exactly", () => {
    expect(runDiodeConductionLoss(diodeConductionLossExample.input)).toEqual({
      ok: true,
      output: diodeConductionLossExample.output,
    });
  });
  it("scales conduction loss with current and voltage", () => {
    expect(
      runDiodeConductionLoss({ averageCurrentA: 2.5, forwardVolts: 0.3 }),
    ).toEqual({ ok: true, output: { conductionLossWatts: 0.75 } });
  });
  it("rejects invalid input", () => {
    expect(
      runDiodeConductionLoss({ averageCurrentA: 1, forwardVolts: -0.7 }).ok,
    ).toBe(false);
  });
});
