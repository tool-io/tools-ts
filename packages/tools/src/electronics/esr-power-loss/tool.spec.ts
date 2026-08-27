import { describe, expect, it } from "vitest";
import { esrPowerLossExample, runEsrPowerLoss } from "./tool.js";
describe("ESR Power Loss", () => {
  it("publishes an executable example", () =>
    expect(runEsrPowerLoss(esrPowerLossExample.input)).toEqual({
      ok: true,
      output: esrPowerLossExample.output,
    }));
  it("quadruples loss when ripple current doubles", () =>
    expect(runEsrPowerLoss({ rippleCurrentArms: 4, esrOhms: 0.05 })).toEqual({
      ok: true,
      output: { esrLossWatts: 0.8 },
    }));
  it("rejects zero ripple current", () =>
    expect(runEsrPowerLoss({ rippleCurrentArms: 0, esrOhms: 0.1 }).ok).toBe(
      false,
    ));
  it("rejects negative ESR", () =>
    expect(runEsrPowerLoss({ rippleCurrentArms: 1, esrOhms: -0.1 }).ok).toBe(
      false,
    ));
});
