import { describe, expect, it } from "vitest";
import {
  electronBalanceRedoxExample,
  runElectronBalanceRedox,
} from "./tool.js";
describe("Electron Balance Check", () => {
  it("publishes an executable example", () =>
    expect(runElectronBalanceRedox(electronBalanceRedoxExample.input)).toEqual({
      ok: true,
      output: electronBalanceRedoxExample.output,
    }));
  it("reports a deficit when reduction gains more electrons", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 5,
        totalReductionElectrons: 8,
      }),
    ).toEqual({
      ok: true,
      output: { balanced: false, electronDifference: -3 },
    }));
  it("reports a surplus when oxidation loses more electrons", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 8,
        totalReductionElectrons: 5,
      }),
    ).toEqual({
      ok: true,
      output: { balanced: false, electronDifference: 3 },
    }));
  it("balances at the upper input limit", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 20,
        totalReductionElectrons: 20,
      }),
    ).toEqual({ ok: true, output: { balanced: true, electronDifference: 0 } }));
  it("balances single-electron exchange", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 1,
        totalReductionElectrons: 1,
      }),
    ).toEqual({ ok: true, output: { balanced: true, electronDifference: 0 } }));
  it("rejects zero oxidation electrons", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 0,
        totalReductionElectrons: 2,
      }).ok,
    ).toBe(false));
  it("rejects counts above twenty", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 21,
        totalReductionElectrons: 2,
      }).ok,
    ).toBe(false));
  it("rejects fractional counts", () =>
    expect(
      runElectronBalanceRedox({
        totalOxidationElectrons: 2.5,
        totalReductionElectrons: 2,
      }).ok,
    ).toBe(false));
});
